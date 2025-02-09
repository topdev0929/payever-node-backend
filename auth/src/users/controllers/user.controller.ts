import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  Query,
  Req,
  Res,
  UseGuards,
  BadRequestException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { classToPlain, plainToClass } from 'class-transformer';
import { validate, ValidationError, isEmail } from 'class-validator';
import { Model } from 'mongoose';
import * as dateFns from 'date-fns';

import {
  TokenHelper,
} from '@pe/nest-kit/modules/auth/token.helper';

import {
  JwtAuthGuard,
  Roles,
  RolesEnum,
  TokensResultModel,
  User,
  UserTokenInterface,
  EventDispatcher,
} from '@pe/nest-kit';
import {
  EditDto,
  ForgotPasswordDto,
  RegisterDto,
  RegisterWithEncryptedPasswordDto,
  ResetPasswordDto,
  UpdateLogoDto,
  UpdatePasswordDto,
  InviteTokenDto,
  ApproveRegistrationDto,
} from '../dto';
import { UserEventProducer } from '../producer';
import { User as UserModel, RegisterEvent, ForgotPasswordEvent } from '../interfaces';
import { UserFilters } from '../interfaces/user-filters.interface';
import { ProfileService, RegistrationService, TrustedDomainService, UserService } from '../services';
import { FastifyRequestWithIpInterface, RequestFingerprint } from '../../auth/interfaces';
import { FastifyResponse } from '../../common/interfaces';
import { TokenCookieWriter } from '../../common';
import { RequestParser } from '../../auth/services';
import { REGISTER_EVENT, FORGOT_PASSWORD_EVENT } from '../constants';
import { IntegrationRegisterDto } from '../dto/integration-register.dto';
import { UserDocument } from '../../users/interfaces';
import { EmployeeService, InvitationService } from '../../employees/services';
import { EncryptionService } from '../../encryption';
import { RegisterEmailDomainException, RegisterInviteTokenException } from '../../brute-force/exceptions';
import { environment } from '../../environments';

const accessGrantedDescription: string = 'Access granted';
const InvalidCredential: string = 'Invalid credentials.';

@Controller('api')
@ApiTags('api')
@UseGuards(JwtAuthGuard)
export class UserController {
  constructor(
    @InjectModel('User') private readonly userModel: Model<UserModel>,
    private readonly userService: UserService,
    private readonly registrationService: RegistrationService,
    private readonly profileService: ProfileService,
    private readonly tokenCookieWriter: TokenCookieWriter,
    private readonly eventDispatcher: EventDispatcher,
    private readonly jwtService: JwtService,
    private readonly employeeService: EmployeeService,
    private readonly encryptionService: EncryptionService,
    private readonly trustedDomainService: TrustedDomainService,
    private readonly userEventProducer: UserEventProducer,
    private readonly invitationService: InvitationService,
  ) { }

  @Patch('/user')
  @Roles(RolesEnum.user)
  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtAuthGuard)
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Invalid credentials' })
  @ApiResponse({ status: HttpStatus.OK, description: accessGrantedDescription })
  public async edit(@User() user: UserTokenInterface, @Body() dto: EditDto): Promise<UserModel> {
    return this.userModel.findOneAndUpdate({ _id: user.id }, classToPlain(dto), { new: true });
  }

  @Get('/user')
  @Roles(RolesEnum.admin, RolesEnum.merchant, RolesEnum.organization, RolesEnum.user)
  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtAuthGuard)
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Invalid credentials' })
  @ApiResponse({ status: HttpStatus.OK, description: accessGrantedDescription })
  public async get(@User() user: UserTokenInterface): Promise<UserModel> {
    return this.userService.findOneBy({ _id: user.id });
  }

  @Get('/users')
  @Roles(RolesEnum.admin)
  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtAuthGuard)
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Invalid credentials' })
  @ApiResponse({ status: HttpStatus.OK, description: accessGrantedDescription })
  public async users(
    @Query('filters') filters: UserFilters,
    @Query('limit') limit: string,
  ): Promise<any> {
    return this.userService.findByFilters(filters, parseInt(limit, 10));
  }

  @Get('user-logo/:email')
  @Roles(RolesEnum.anonymous)
  @HttpCode(HttpStatus.OK)
  @ApiResponse({ status: HttpStatus.OK, description: 'Returns logo uuid.' })
  public async getLogo(@Param('email') email: string): Promise<any> {
    return this.profileService.getLogo(email?.toLowerCase());
  }

  @Get('email/:email/validate')
  @Roles(RolesEnum.anonymous)
  @HttpCode(HttpStatus.OK)
  public async checkEmail(@Param('email') email: string): Promise<any> {
    const available: boolean = await this.userService.checkEmailUnique(email?.toLowerCase());
    const valid: boolean = isEmail(email?.toLowerCase());

    return {
      available,
      valid,
    };
  }

  @Post('integration/register')
  @Roles(RolesEnum.anonymous)
  @HttpCode(HttpStatus.OK)
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: InvalidCredential })
  @ApiResponse({ status: HttpStatus.OK, type: TokensResultModel, description: accessGrantedDescription })
  public async integrationR(
    @Body() dto: IntegrationRegisterDto,
    @Req() request: FastifyRequestWithIpInterface,
    @Res() response: FastifyResponse,
  ): Promise<void> {
    await this.register(dto.data as any, request, response);
  }

  @Post('register')
  @Roles(RolesEnum.anonymous)
  @HttpCode(HttpStatus.OK)
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: InvalidCredential })
  @ApiResponse({ status: HttpStatus.OK, type: TokensResultModel, description: accessGrantedDescription })
  public async register(
    @Body() dtoWithEncryptedPassword: RegisterWithEncryptedPasswordDto,
    @Req() request: FastifyRequestWithIpInterface,
    @Res() response: FastifyResponse,
  ): Promise<void> {

    const dto: RegisterDto = plainToClass(RegisterDto, dtoWithEncryptedPassword);

    await this.decryptPassword(dto, dtoWithEncryptedPassword);

    const errors: ValidationError[] = await validate(dto);
    if (errors && errors.length) {
      throw new BadRequestException(errors);
    }

    const parsedRequest: RequestFingerprint = RequestParser.parse(request);

    const isValid: boolean = await this.registrationService.isUserExist(dto);

    let isInvitedEmployee: boolean = false;
    if (dto.inviteToken) {
      const inviteToken: any = dto.inviteToken ? this.jwtService.decode(dto.inviteToken) : null;
      const inviteTokenDto: InviteTokenDto = inviteToken ? plainToClass(InviteTokenDto, inviteToken) : null;
      const validationErrors: ValidationError[] = inviteTokenDto ? await validate(inviteTokenDto) : [];

      if (!inviteTokenDto || validationErrors.length > 0) {
        throw new RegisterInviteTokenException();
      }
      const expiredDate: Date =
        inviteTokenDto.exp ? new Date(inviteToken.exp * 1000) : dateFns.addMinutes(new Date(), -1);

      if (inviteTokenDto.email.toLowerCase() !== dto.email || expiredDate < new Date()) {
        throw new RegisterInviteTokenException();
      }

      isInvitedEmployee = await this.employeeService.findOneBy({ _id: inviteTokenDto.id }) !== null;
    }

    const bulkEventId: string = request.headers['X-Bulk-Event-Id'];

    const registerEvent: RegisterEvent = {
      bulkEventId,
      isInvitedEmployee,
      isValid,
      parsedRequest,
      registerDto: dto,
    };
    await this.eventDispatcher.dispatch(
      REGISTER_EVENT,
      registerEvent,
    );

    const tokenObject: TokensResultModel = await this.registrationService.register(dto, request);
    this.tokenCookieWriter.setTokenToCookie(response, tokenObject);
    response.status(HttpStatus.OK).send(tokenObject);
  }

  @Post('register/business/:businessId')
  @Roles(RolesEnum.anonymous)
  @HttpCode(HttpStatus.OK)
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: InvalidCredential })
  @ApiResponse({ status: HttpStatus.OK, type: TokensResultModel, description: accessGrantedDescription })
  public async submitRegistrationByTrustedDomain(
    @Body() dto: RegisterDto,
    @Param('businessId') businessId: string,
    @Req() request: FastifyRequestWithIpInterface,
    @Res() response: FastifyResponse,
  ): Promise<void> {
    const parsedRequest: RequestFingerprint = RequestParser.parse(request);

    const isValid: boolean = await this.registrationService.isUserExist(dto);

    if (dto.inviteToken) {
      throw new RegisterInviteTokenException();
    }

    const isInvitedEmployee: boolean =
      await this.trustedDomainService.isDomainTrusted(dto.email.split('@').pop(), businessId);

    if (!isInvitedEmployee) {
      throw new RegisterEmailDomainException();
    }

    const bulkEventId: string = request.headers['X-Bulk-Event-Id'];

    const registerEvent: RegisterEvent = {
      bulkEventId,
      isInvitedEmployee,
      isValid,
      parsedRequest,
      registerDto: dto,
    };
    await this.eventDispatcher.dispatch(
      REGISTER_EVENT,
      registerEvent,
    );

    const tokenObject: TokensResultModel = await this.registrationService.register(dto, request, true);
    this.tokenCookieWriter.setTokenToCookie(response, tokenObject);
    response.status(HttpStatus.OK).send(tokenObject);
  }

  @Get('registration/business/:businessId')
  @Roles(RolesEnum.merchant)
  public async registerByTrustedDomain(
    @Param('businessId') businessId: string,
  ): Promise<string> {
    return `${environment.commerceOSRegisterUrl}/${businessId}`;
  }

  @Patch('approve-registration/business/:businessId')
  @Roles(RolesEnum.merchant)
  public async approveUserRegistration(
    @Param('businessId') businessId: string,
    @Body() dto: ApproveRegistrationDto,
  ): Promise<void> {
    return this.userService.approveRegistration(businessId, dto);
  }

  @Get('approve-queue/business/:businessId')
  @Roles(RolesEnum.merchant)
  public async getApproveQueue(
    @Param('businessId') businessId: string,
  ): Promise<UserModel[]> {
    return this.userService.getApproveQueueByBusiness(businessId);
  }

  @Post('employee/register/:businessId')
  @Roles(RolesEnum.anonymous)
  @HttpCode(HttpStatus.OK)
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: InvalidCredential })
  @ApiResponse({ status: HttpStatus.OK, type: TokensResultModel, description: accessGrantedDescription })
  public async employeeRegisterationForBusiness(
    @Param('businessId') businessId: string,
    @Body() dtoWithEncryptedPassword: RegisterWithEncryptedPasswordDto,
    @Req() request: FastifyRequestWithIpInterface,
    @Res() response: FastifyResponse,
  ): Promise<void> {
    const passwordCombo: string = await this.encryptionService.decrypt(dtoWithEncryptedPassword.password);
    const plainPassword: string = this.encryptionService.extractPassword(passwordCombo);

    const dto: RegisterDto = plainToClass(RegisterDto, {
      ...dtoWithEncryptedPassword,
      password: plainPassword,
    });
    const errors: ValidationError[] = await validate(dto);
    if (errors && errors.length) {
      throw new BadRequestException(errors);
    }

    const parsedRequest: RequestFingerprint = RequestParser.parse(request);

    const isValid: boolean = await this.registrationService.isUserExist(dto);

    const bulkEventId: string = request.headers['X-Bulk-Event-Id'];

    const registerEvent: RegisterEvent = {
      bulkEventId,
      isInvitedEmployee: false,
      isValid,
      parsedRequest,
      registerDto: dto,
    };

    await this.eventDispatcher.dispatch(
      REGISTER_EVENT,
      registerEvent,
    );

    const tokenObject: TokensResultModel = await this.registrationService.register(dto, request, false, true, true);
    const data: any = await this.invitationService.createAndInviteEmployeeForBusiness(
      dtoWithEncryptedPassword.email,
      dtoWithEncryptedPassword.firstName,
      dtoWithEncryptedPassword.lastName,
      dtoWithEncryptedPassword.language,
      businessId,
    );

    await this.userEventProducer.produceUserRegisteredEvent({
      userInfo: {
        language: dto.language,
      },
      userToken: TokenHelper.extractTokenString(tokenObject.accessToken).user,
    });
    this.tokenCookieWriter.setTokenToCookie(response, tokenObject);
    response.status(HttpStatus.OK).send({ ...tokenObject, ...data });    
  }

  @Post('employee/register')
  @Roles(RolesEnum.anonymous)
  @HttpCode(HttpStatus.OK)
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: InvalidCredential })
  @ApiResponse({ status: HttpStatus.OK, type: TokensResultModel, description: accessGrantedDescription })
  public async employeeRegister(
    @Body() dtoWithEncryptedPassword: RegisterWithEncryptedPasswordDto,
    @Req() request: FastifyRequestWithIpInterface,
    @Res() response: FastifyResponse,
  ): Promise<void> {
    const passwordCombo: string = await this.encryptionService.decrypt(dtoWithEncryptedPassword.password);
    const plainPassword: string = this.encryptionService.extractPassword(passwordCombo);

    const dto: RegisterDto = plainToClass(RegisterDto, {
      ...dtoWithEncryptedPassword,
      password: plainPassword,
    });
    await validate(dto);

    const parsedRequest: RequestFingerprint = RequestParser.parse(request);

    const isValid: boolean = await this.registrationService.isUserExist(dto);
    const inviteToken: any = dto.inviteToken ? this.jwtService.decode(dto.inviteToken) : null;

    if (!inviteToken) {
      throw new RegisterInviteTokenException();
    }

    let isInvitedEmployee: boolean = false;

    const inviteTokenDto: InviteTokenDto = plainToClass(InviteTokenDto, inviteToken);
    const validationErrors: ValidationError[] = await validate(inviteTokenDto);

    if (!inviteTokenDto || validationErrors.length > 0)  {
      throw new RegisterInviteTokenException();
    }
    const expiredDate: Date =
      inviteTokenDto.exp ? new Date(inviteToken.exp * 1000) : dateFns.addMinutes(new Date(), -1);

    if (inviteTokenDto.email.toLowerCase() !== dto.email || expiredDate < new Date() ) {
      throw new RegisterInviteTokenException();
    }

    isInvitedEmployee = await this.employeeService.findOneBy({ _id: inviteTokenDto.id}) !== null;

    const bulkEventId: string = request.headers['X-Bulk-Event-Id'];

    const registerEvent: RegisterEvent = {
      bulkEventId,
      isInvitedEmployee,
      isValid,
      parsedRequest,
      registerDto: dto,
    };
    await this.eventDispatcher.dispatch(
      REGISTER_EVENT,
      registerEvent,
    );

    const tokenObject: TokensResultModel = await this.registrationService.register(dto, request, false, true, true);
    await this.userEventProducer.produceUserRegisteredEvent({
      userInfo: {
        language: dto.language,
      },
      userToken: TokenHelper.extractTokenString(tokenObject.accessToken).user,
    });
    this.tokenCookieWriter.setTokenToCookie(response, tokenObject);
    response.status(HttpStatus.OK).send(tokenObject);
  }

  @Post('confirm/:token')
  @Roles(RolesEnum.anonymous)
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Bad request.' })
  @ApiResponse({ status: HttpStatus.NO_CONTENT, description: 'Success.' })
  public async confirm(@Param('token') token: string): Promise<void> {
    await this.registrationService.confirmRegistration(token);
  }

  @Post('forgot')
  @HttpCode(HttpStatus.NO_CONTENT)
  @Roles(RolesEnum.anonymous)
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: InvalidCredential })
  @ApiResponse({ status: HttpStatus.OK, description: accessGrantedDescription })
  public async forgot(
    @Req() request: FastifyRequestWithIpInterface,
    @Body() forgotPasswordDto: ForgotPasswordDto,
  ): Promise<void> {
    const user: UserDocument | undefined = await this.userService.findOneByEmail(forgotPasswordDto.email);
    const parsedRequest: RequestFingerprint = RequestParser.parse(request);

    const forgotPasswordEvent: ForgotPasswordEvent
      = { user, parsedRequest, forgotPasswordDto };

    await this.eventDispatcher.dispatch(
      FORGOT_PASSWORD_EVENT,
      forgotPasswordEvent,
    );

    await this.registrationService.forgotPassword(forgotPasswordDto.email, forgotPasswordDto.language);
  }

  @Post('reset/:token')
  @Roles(RolesEnum.anonymous)
  @HttpCode(HttpStatus.OK)
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Bad request.' })
  @ApiResponse({ status: HttpStatus.NO_CONTENT, description: 'Success.' })
  public async resetPassword(@Param('token') token: string, @Body() resetPasswordDto: ResetPasswordDto): Promise<void> {
    await this.registrationService.resetPassword(token, resetPasswordDto.plainPassword);
  }

  @Post('update-logo')
  @HttpCode(HttpStatus.OK)
  @Roles(RolesEnum.user)
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: InvalidCredential })
  @ApiResponse({ status: HttpStatus.OK, description: accessGrantedDescription })
  public async updateLogo(@Body() updateLogoDto: UpdateLogoDto): Promise<void> {
    await this.profileService.updateLogo(updateLogoDto);
  }

  @Post('update')
  @HttpCode(HttpStatus.OK)
  @Roles(RolesEnum.user)
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Invalid current plainPassword.' })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: InvalidCredential })
  @ApiResponse({ status: HttpStatus.OK, description: accessGrantedDescription })
  public async updatePassword(
    @User() user: UserTokenInterface,
    @Body() updatePasswordDto: UpdatePasswordDto,
  ): Promise<void> {
    await this.profileService.updatePassword(user, updatePasswordDto);
  }

  private async decryptPassword(
    dto: RegisterDto,
    dtoWithEncryptedPassword: RegisterWithEncryptedPasswordDto,
  ): Promise<void> {
    if (!dto.forceGeneratePassword) {
      const passwordCombo: string = await this.encryptionService.decrypt(dtoWithEncryptedPassword.password);
      const plainPassword: string = this.encryptionService.extractPassword(passwordCombo);
      dto.password = plainPassword;
    }
  }
}
