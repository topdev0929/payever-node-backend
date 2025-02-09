import { BadRequestException, forwardRef, Inject, Logger } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import { TokensResultModel, RolesEnum } from '@pe/nest-kit';
import * as crypto from 'crypto';
import { Model } from 'mongoose';
import { FastifyRequestWithIpInterface, RequestFingerprint } from '../../auth/interfaces';
import { LocationService, RequestParser, TokenService } from '../../auth/services';
import { environment } from '../../environments';
import { RegisterDto } from '../dto';
import { User } from '../interfaces';
import { MailerEventProducer } from '../producer';
import { PasswordEncoder } from '../tools';
import { SuspiciousActivityService } from '../../brute-force/services';

export class RegistrationService {
  constructor(
    @Inject(forwardRef(() => TokenService))
    private readonly tokenService: TokenService,
    private readonly mailerEventProducer: MailerEventProducer,
    private readonly jwtService: JwtService,
    private readonly logger: Logger,
    @Inject(forwardRef(() => LocationService))
    private readonly locationService: LocationService,
    @InjectModel('User') private readonly userModel: Model<User>,
    @Inject(forwardRef(() => SuspiciousActivityService))
    private readonly suspiciousActivityService: SuspiciousActivityService,
  ) { }

  public async isUserExist(dto: RegisterDto): Promise<boolean> {
    const existedUser: User = await this.userModel.findOne({ email: dto.email }).exec();
    if (existedUser && !existedUser.password) {
      return true;
    }

    try {
      const user: User = new this.userModel(dto);
      await user.validate();
    } catch (error) {
      return false;
    }

    return true;
  }

  public async registerUser(
    dto: RegisterDto,
    needsApprove: boolean = false, 
    isVerified: boolean = false,
  ): Promise<User> {
    const existedUser: User = await this.userModel.findOne({ email: dto.email }).exec();
    if (existedUser && !existedUser.password) {
      const salt: string = PasswordEncoder.salt();
      await this.userModel.updateOne(
        { email: existedUser.email },
        {
          $set: {
            firstName: dto.firstName,
            isVerified: existedUser.isVerified ? existedUser.isVerified : isVerified,
            lastName: dto.lastName,
            password: PasswordEncoder.encodePassword(dto.password, salt),
            salt,
          },
        },
      ).exec();

      return this.userModel.findOne({ email: dto.email }).exec();
    }

    const user: User = await this.userModel.create({
      email: dto.email,
      firstName: dto.firstName,
      isApproved: false,
      isVerified: isVerified,
      lastName: dto.lastName,
      needsApprove: needsApprove,
      roles: [
        {
          name: RolesEnum.user,
        },
      ],
    });

    if (dto.password) {
      user.salt = PasswordEncoder.salt();
      user.password = PasswordEncoder.encodePassword(dto.password, user.salt);
    }

    await user.save();

    if (!isVerified) {
      await this.sendRegisterConfirmEmail(user, dto.language);
    }

    if (dto.forceGeneratePassword) {
      const token: string = crypto.randomBytes(20).toString('hex');
      user.resetPasswordToken = token;
      user.resetPasswordExpires = new Date(Date.now() + 60 * 60 * 24000); // 24 hours
      await this.sendTempPasswordEmail(user, token, dto.language);
      await user.save();
    }

    return user;
  }

  public async register(
    dto: RegisterDto,
    request: FastifyRequestWithIpInterface,
    needsApprove: boolean = false,
    isVerified: boolean = false,
    verifyLocation: boolean = false,
  ): Promise<TokensResultModel> {
    const parsedRequest: RequestFingerprint = RequestParser.parse(request);

    const existedUser: User = await this.userModel.findOne({ email: dto.email }).exec();

    const user: User = await this.registerUser(dto, needsApprove, isVerified);

    if (existedUser) {
      return this.tokenService.issueToken(user, parsedRequest, null);
    }

    await this.locationService.addLocation(user._id as unknown as any, parsedRequest);
    if (verifyLocation) {
      await this.locationService.verifyLocation(user, parsedRequest);
    }

    return this.tokenService.issueToken(user, parsedRequest, null);
  }

  public async confirmRegistration(token: string): Promise<void> {
    const decodeToken: (_token: string) => { email: string } = (_token: string): never | { email: string } => {
      try {
        return this.jwtService.verify(_token);
      } catch (e) {
        this.logger.warn(e);
        throw new BadRequestException('Token is not valid');
      }
    };

    const user: User = await this.userModel.findOne({ email: decodeToken(token).email }).exec();

    if (user) {
      user.isVerified = true;
      await user.save();
    }
  }

  public async resetPassword(token: string, plainPassword: string): Promise<void> {
    const user: User = await this.userModel.findOne({
      resetPasswordExpires: { $gt: new Date() },
      resetPasswordToken: token,
    }).exec();

    if (!user) {
      throw new BadRequestException('Token is either expired or invalid');
    }

    user.salt = PasswordEncoder.salt();
    user.password = PasswordEncoder.encodePassword(plainPassword, user.salt);
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;

    await Promise.all([
      user.save(),
      this.tokenService.revokeTokens(user._id, false),
      this.suspiciousActivityService.clearLoginFailures(user._id, null),
      this.suspiciousActivityService.removeUserFromBlockList(user._id),
    ]);
  }

  public async forgotPassword(email: string, language: string): Promise<void> {
    const user: User = await this.userModel.findOne(
      { email: { $regex: new RegExp('^' + this.escapeRegex(email.toLowerCase()), 'i') } },
    ).exec();

    if (!user) {
      return;
    }

    const token: string = crypto.randomBytes(20).toString('hex');
    user.resetPasswordToken = token;
    user.resetPasswordExpires = new Date(Date.now() + 60 * 60 * 1000); // 1 hour
    await user.save();
    const url: string = `${environment.commerseOSUrl}/password/reset/${token}`;

    await this.mailerEventProducer.producePasswordResetEmailMessage(url, user.email, language);
  }

  private escapeRegex(str: string) {
    return str.replace(/[/\-\\^$*+?.()|[\]{}]/g, '\\$&');
  }
  
  private async sendTempPasswordEmail(user: User, token: string, language: string): Promise<void> {
    const url: string = `${environment.commerseOSUrl}/password/reset/${token}`;
    await this.mailerEventProducer.producePasswordSetEmailMessage(url, user.email, language);
  }

  private async sendRegisterConfirmEmail(user: User, language: string): Promise<void> {
    const emailToken: string = this.jwtService.sign({ email: user.email });
    const verificationLink: string = `${environment.commerseOSUrl}/confirmation/${emailToken}`;

    await this.mailerEventProducer.produceRegisterConfirmationEmailMessage(verificationLink, user.email, language);
  }
}
