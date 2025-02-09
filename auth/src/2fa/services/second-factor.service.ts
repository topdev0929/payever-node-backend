import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { EventDispatcher, TokensResultModel, TokenType } from '@pe/nest-kit';
import { Model } from 'mongoose';

import { LocationService, RequestParser, TokenService } from '../../auth/services';
import { UserService } from '../../users/services';
import { User } from '../../users/interfaces';
import { MailerEventProducer } from '../../users/producer';
import { SecondFactorEvent, SecondFactorTokenInterface } from '../interfaces';
import { SecondFactorTokenSchemaName } from '../schemas';
import { CodeNumberGenerator } from './code-number-generator.service';
import { FastifyRequestWithIpInterface, RefreshTokenInterface, RequestFingerprint } from '../../auth/interfaces';
import { SECOND_FACTOR_EVENT } from '../constants';

@Injectable()
export class SecondFactorService {
  constructor(
    private readonly tokenService: TokenService,
    private readonly codeGenerator: CodeNumberGenerator,
    @InjectModel(SecondFactorTokenSchemaName)
    private readonly secondFactorTokenModel: Model<SecondFactorTokenInterface>,
    private readonly mailerEventProducer: MailerEventProducer,
    private readonly locationService: LocationService,
    private readonly eventDispatcher: EventDispatcher,
  ) { }

  public async generate(user: User, language: string): Promise<void> {
    const code: number = await this.codeGenerator.generate(user._id);

    await Promise.all([
      this.secondFactorTokenModel.updateMany(
        { userId: user._id, code: { $ne: code }, active: true },
        { active: false },
      ),
      this.secondFactorTokenModel.create({
        code,
        userId: user._id,
      } as SecondFactorTokenInterface),

      this.mailerEventProducer.produceIdVerificationEmailMessage(code, user, language),
    ]);
  }

  public async resend(tokenId: string, language: string): Promise<void> {
    const refreshToken: RefreshTokenInterface = await this.tokenService.getToken({ _id: tokenId, revoked: false });
    const user: User = refreshToken.user as User;

    return this.generate(user, language);
  }

  public async validate(
    tokenId: string,
    code: number,
    request: FastifyRequestWithIpInterface,
  ): Promise<TokensResultModel> {
    const parsedRequest: RequestFingerprint = RequestParser.parse(request);
    const refreshToken: RefreshTokenInterface = await this.tokenService.getToken({ _id: tokenId, revoked: false });
    const user: User = refreshToken.user as User;
    const codeEntity: SecondFactorTokenInterface = await this.secondFactorTokenModel.findOne({
      active: true,
      code,
      userId: user.id,
    }).exec();

    if (!codeEntity) {
      throw new UnauthorizedException('Code is invalid, please generate a new one.');
    }

    codeEntity.active = false;
    await codeEntity.save();

    await this.locationService.verifyLocation(user, parsedRequest);

    const tokensResultModel: TokensResultModel = await this.tokenService.issueToken(
      user,
      parsedRequest,
      refreshToken.businessId,
      UserService.isSecondFactorAuth(user) ? TokenType.secondFactor : TokenType.secondFactorTemporary,
    );
    const secondFactorEvent: SecondFactorEvent = { user, parsedRequest, response: tokensResultModel, success: true };
    this.eventDispatcher.dispatch(SECOND_FACTOR_EVENT, secondFactorEvent);

    return tokensResultModel;
  }
}
