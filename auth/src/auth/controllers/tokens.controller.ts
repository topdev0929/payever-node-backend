import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  NotFoundException,
  Post,
  Patch,
  Req,
  Res,
  UseGuards,
  Logger,
  Param,
  ForbiddenException,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiResponse, ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import {
  AccessTokenResultModel,
  EventDispatcher,
  JwtAuthGuard,
  Roles,
  RolesEnum,
  TokensResultModel,
  User,
  UserTokenInterface,
  ParamModel,
} from '@pe/nest-kit';
import { SecondFactorService } from '../../2fa/services';
import { WrongPasswordException, CaptchaException, UserNotApprovedException } from '../../brute-force/exceptions';
import { User as UserModel, UserDocument } from '../../users/interfaces';
import { UserService } from '../../users/services';
import { PasswordEncoder } from '../../users/tools';
import { LOGIN_EVENT } from '../constants';
import {
  DeleteTokensDto,
  GuestTokenRequestDto,
  IntegrationLoginRequestDto,
  LoginAsUserRequestDto,
  LoginRequestDto,
} from '../dto';
import {
  FastifyRequestWithIpInterface,
  LoginEvent,
  RefreshPayload,
  RefreshTokenInterface,
  RequestFingerprint,
} from '../interfaces';
import { LocationService, RequestParser, TokenService } from '../services';
import { FastifyResponse } from '../../common/interfaces';
import { TokenCookieWriter } from '../../common';
import { SuspiciousActivityService } from '../../brute-force/services';
import { EncryptionService } from '../../encryption';
import { BusinessEnabledEventProducer } from '../producer';
import { TokenType } from '@pe/nest-kit/modules/auth/enums/token-type.enum';
import { EmployeeService, InvitationService } from '../../employees/services';
import { Employee, PositionInterface } from '../../employees/interfaces';
import { BusinessSchemaName } from '@pe/business-kit';
import { BusinessLocal } from '../../business/schemas';
import { UserTypeBusinessEnum } from '../enum';
import { Positions } from '../../employees/enum';

const INVALID_CREDENTIALS_MESSAGE: string = 'Invalid credentials';
const ACCESS_GRANTED: string = 'Access granted.';

@Controller('api')
@ApiTags('auth')
export class TokensController {
  constructor(
    private readonly logger: Logger,
    private readonly eventDispatcher: EventDispatcher,
    private readonly userService: UserService,
    private readonly tokenService: TokenService,
    private readonly locationService: LocationService,
    private readonly secondFactorService: SecondFactorService,
    private readonly tokenCookieWriter: TokenCookieWriter,
    private readonly businessEnabledProducer: BusinessEnabledEventProducer,
    private readonly suspiciousActivityService: SuspiciousActivityService,
    private readonly encryptionService: EncryptionService,
    private readonly employeeService: EmployeeService,
    private readonly invitationService: InvitationService,
  ) { }

  @Post('/integration/login')
  @Roles(RolesEnum.anonymous)
  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtAuthGuard)
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: INVALID_CREDENTIALS_MESSAGE })
  @ApiResponse({ status: HttpStatus.OK, type: TokensResultModel, description: ACCESS_GRANTED })
  public async integrationLogin(
    @Req() request: FastifyRequestWithIpInterface,
    @Res() response: FastifyResponse,
    @Body() integrationLoginRequestDto: IntegrationLoginRequestDto,
  ): Promise<void> {
    await this.login(request, response, integrationLoginRequestDto.data);
  }

  @Patch('business/:businessId/enable')
  @Roles(RolesEnum.anonymous)
  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: INVALID_CREDENTIALS_MESSAGE })
  @ApiResponse({ status: HttpStatus.OK, type: TokensResultModel, description: ACCESS_GRANTED })
  public async enableBusiness(
    @Req() request: FastifyRequestWithIpInterface,
    @Res() response: FastifyResponse,
    @User() userToken: UserTokenInterface,
    @Param('businessId') businessId: string,
  ): Promise<void> {
    if (!userToken) {
      throw new ForbiddenException('User not found.');
    }

    const user: UserModel = await this.userService.findAndPopulateWithBusiness(userToken.id, businessId);
    const parsedRequest: RequestFingerprint = RequestParser.parse(request);
    await this.businessEnabledProducer.produceBusinessEnabledEvent(userToken, businessId);

    const result: any = await this.tokenService.issueToken(user, parsedRequest, businessId, TokenType.common);
    this.tokenCookieWriter.setTokenToCookie(
      response,
      result,
    );
    response.status(HttpStatus.OK).send(result);
  }


  @Get('business/:businessId/enable/access')
  @Roles(RolesEnum.anonymous)
  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: INVALID_CREDENTIALS_MESSAGE })
  @ApiResponse({ status: HttpStatus.OK, type: TokensResultModel, description: ACCESS_GRANTED })
  public async getBusinessAccessDetails(
    @ParamModel('businessId', BusinessSchemaName) business: BusinessLocal,
    @User() userToken: UserTokenInterface,
  ): Promise<{
    hasAccess: boolean;
    userTypeBusiness?: UserTypeBusinessEnum;
  }> {

    const isOwner: boolean = userToken.id === business.owner;

    if (isOwner) {
      return {
        hasAccess: true,
        userTypeBusiness: UserTypeBusinessEnum.Owner,
      };
    }

    const businessPosition: PositionInterface = await this.employeeService.employeePosition(
      userToken.email,
      business._id,
    );

    if (!businessPosition) {

      return {
        hasAccess: false,
      };
    }

    const isAdmin: boolean = businessPosition.positionType === Positions.admin;

    return {
      hasAccess: true,
      userTypeBusiness: isAdmin ? UserTypeBusinessEnum.EmployeeAdmin : UserTypeBusinessEnum.Employee,
    };

  }

  @Post('/login')
  @Roles(RolesEnum.anonymous)
  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtAuthGuard)
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: INVALID_CREDENTIALS_MESSAGE })
  @ApiResponse({ status: HttpStatus.OK, type: TokensResultModel, description: ACCESS_GRANTED })
  public async login(
    @Req() request: FastifyRequestWithIpInterface,
    @Res() response: FastifyResponse,
    @Body() loginDto: LoginRequestDto,
  ): Promise<void> {
    const user: UserDocument | undefined = await this.userService.findOneByEmail(loginDto.email);
    const employee: Employee = await this.employeeService.findOneBy({ email: loginDto.email });
    const parsedRequest: RequestFingerprint = RequestParser.parse(request);

    if (loginDto.encryptedPassword) {
      const passwordCombo: string = await this.encryptionService.decrypt(loginDto.encryptedPassword);
      const plainPassword: string = this.encryptionService.extractPassword(passwordCombo);
      loginDto.plainPassword = plainPassword;
    }

    const isValidPassword: boolean = user
      ? PasswordEncoder.isPasswordValid(loginDto.plainPassword, user.salt, user.password)
      : false;

    const loginEvent: LoginEvent =
      { user, parsedRequest, loginDto, isValidPassword, isSecurityQuestionDefined: false, employee };
    await this.eventDispatcher.dispatch(
      LOGIN_EVENT,
      loginEvent,
    );

    if (!loginEvent.response) {
      if (loginEvent.loginDto.recaptchaToken) {
        throw new CaptchaException();
      } else {
        throw new WrongPasswordException();
      }
    }

    if (user.needsApprove && !user.isApproved) {
      throw new UserNotApprovedException();
    }

    if (
      UserService.isSecondFactorAuth(user)
      || user.isAdmin()
      || !(await this.locationService.isLocationVerified(user, parsedRequest))
    ) {
      await this.secondFactorService.generate(loginEvent.user, user.language);
      loginEvent.response = await this.tokenService.issueToken(user, parsedRequest, null, TokenType.secondFactorAuth);
      loginEvent.response && delete loginEvent.response.accessToken;
      loginEvent.response.isSecurityQuestionDefined = loginEvent.isSecurityQuestionDefined;
    }

    this.tokenCookieWriter.setTokenToCookie(
      response,
      loginEvent.response,
    );

    await this.suspiciousActivityService.removeUserFromBlockList(user._id);
    await this.suspiciousActivityService.clearLoginFailures(user._id, null);

    response.status(HttpStatus.OK).send(loginEvent.response);
  }

  @Post('/login/employee/:businessId')
  @Roles(RolesEnum.anonymous)
  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtAuthGuard)
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: INVALID_CREDENTIALS_MESSAGE })
  @ApiResponse({ status: HttpStatus.OK, type: TokensResultModel, description: ACCESS_GRANTED })
  public async employeeLogin(
    @Req() request: FastifyRequestWithIpInterface,
    @Res() response: FastifyResponse,
    @Body() loginDto: LoginRequestDto,
    @Param('businessId') businessId: string,
  ): Promise<void> {
    const user: UserDocument | undefined = await this.userService.findOneByEmail(loginDto.email);
    const employee: Employee = await this.employeeService.findOneBy({ email: loginDto.email });
    const parsedRequest: RequestFingerprint = RequestParser.parse(request);

    if (loginDto.encryptedPassword) {
      const passwordCombo: string = await this.encryptionService.decrypt(loginDto.encryptedPassword);
      const plainPassword: string = this.encryptionService.extractPassword(passwordCombo);
      loginDto.plainPassword = plainPassword;
    }

    const isValidPassword: boolean = user
      ? PasswordEncoder.isPasswordValid(loginDto.plainPassword, user.salt, user.password)
      : false;

    const loginEvent: LoginEvent =
      { user, parsedRequest, loginDto, isValidPassword, isSecurityQuestionDefined: false, employee };
    await this.eventDispatcher.dispatch(
      LOGIN_EVENT,
      loginEvent,
    );

    if (!loginEvent.response) {
      if (loginEvent.loginDto.recaptchaToken) {
        throw new CaptchaException();
      } else {
        throw new WrongPasswordException();
      }
    }

    if (user.needsApprove && !user.isApproved) {
      throw new UserNotApprovedException();
    }

    if (
      UserService.isSecondFactorAuth(user)
      || user.isAdmin()
      || !(await this.locationService.isLocationVerified(user, parsedRequest))
    ) {
      await this.secondFactorService.generate(loginEvent.user, user.language);

      loginEvent.response = await this.tokenService.issueToken(
        user,
        parsedRequest,
        businessId,
        TokenType.secondFactorAuth,
      );

      loginEvent.response && delete loginEvent.response.accessToken;
      loginEvent.response.isSecurityQuestionDefined = loginEvent.isSecurityQuestionDefined;
    }


    this.tokenCookieWriter.setTokenToCookie(
      response,
      loginEvent.response,
    );

    await this.suspiciousActivityService.removeUserFromBlockList(user._id);
    await this.suspiciousActivityService.clearLoginFailures(user._id, null);

    const data: any = await this.invitationService.createAndInviteEmployeeForBusiness(
      user.email,
      user.firstName,
      user.lastName,
      user.language,
      businessId,
    );

    response.status(HttpStatus.OK).send({ ...loginEvent.response, ...data });
  }

  @Post('/login-as-user')
  @Roles(RolesEnum.admin)
  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtAuthGuard)
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: INVALID_CREDENTIALS_MESSAGE })
  @ApiResponse({ status: HttpStatus.OK, type: TokensResultModel, description: ACCESS_GRANTED })
  public async loginAsUser(
    @Body() dto: LoginAsUserRequestDto,
    @Req() request: FastifyRequestWithIpInterface,
    @Res() response: FastifyResponse,
  ): Promise<void> {
    const d1: number = Date.now();
    let user: UserDocument;
    const parsedRequest: RequestFingerprint = RequestParser.parse(request);
    const d2: number = Date.now();
    if (dto.id) {
      user = await this.userService.findOneBy({ _id: dto.id });
    }
    const d3: number = Date.now();
    if (!user) {
      throw new NotFoundException(`User not found`);
    }

    const tokenObject: TokensResultModel = await this.tokenService.issueToken(user, parsedRequest, null);
    const d4: number = Date.now();
    this.tokenCookieWriter.setTokenToCookie(
      response,
      tokenObject,
    );
    response.status(HttpStatus.OK).send(tokenObject);
    if (d4 - d1 > 1000) {
      this.logger.error({
        dto,
        message: 'login as user lags',
        timestamps: [d1, d2, d3, d4],
        user,
      });
    }
  }

  @Post('/guest-token')
  @Roles(RolesEnum.anonymous)
  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtAuthGuard)
  @ApiResponse({ status: HttpStatus.OK, type: AccessTokenResultModel, description: ACCESS_GRANTED })
  public async issueGuestToken(
    @Body() dto: GuestTokenRequestDto,
    @Req() request: FastifyRequestWithIpInterface,
  ): Promise<AccessTokenResultModel> {
    return this.tokenService.issueGuestToken(request, dto);
  }

  @Get('/refresh')
  @Roles(RolesEnum.user)
  @HttpCode(HttpStatus.OK)
  @UseGuards(AuthGuard('refresh'))
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: INVALID_CREDENTIALS_MESSAGE })
  @ApiResponse({ status: HttpStatus.OK, type: TokensResultModel, description: 'Access granted.' })
  public async refresh(
    @User() user: RefreshPayload,
    @Req() request: FastifyRequestWithIpInterface,
    @Res() response: FastifyResponse,
  ): Promise<void> {
    const parsedRequest: RequestFingerprint = RequestParser.parse(request);

    const tokenObject: TokensResultModel = await this.tokenService.refreshToken(user, parsedRequest);
    this.tokenCookieWriter.setTokenToCookie(
      response,
      tokenObject,
    );
    response.status(HttpStatus.OK).send(tokenObject);
  }

  @Get('/sessions')
  @Roles(RolesEnum.user)
  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtAuthGuard)
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: INVALID_CREDENTIALS_MESSAGE })
  @ApiResponse({ status: HttpStatus.OK, type: AccessTokenResultModel, description: 'Access granted.' })
  public async listTokens(@User() user: UserTokenInterface): Promise<RefreshTokenInterface[]> {
    return this.tokenService.getTokens(user.id);
  }

  @Post('/logout')
  @Roles(RolesEnum.user)
  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtAuthGuard)
  public async logout(@User() user: UserTokenInterface): Promise<RefreshTokenInterface[]> {
    return this.tokenService.deleteToken(user);
  }

  @Delete('/sessions')
  @Roles(RolesEnum.user)
  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtAuthGuard)
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: INVALID_CREDENTIALS_MESSAGE })
  @ApiResponse({ status: HttpStatus.OK, type: AccessTokenResultModel, description: 'Access granted.' })
  public async deleteTokens(
    @User() user: UserTokenInterface,
    @Body() dto: DeleteTokensDto,
    @Res() response: FastifyResponse,
  ): Promise<void> {
    this.tokenCookieWriter.unsetTokenInCookie(
      response,
    );
    await this.tokenService.revokeTokens(user.id, dto.tokens);
    response.status(HttpStatus.OK).send();
  }
}
