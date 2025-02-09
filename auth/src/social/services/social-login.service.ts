import { Injectable, ForbiddenException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import {
  EventDispatcher,
  TokensResultModel,
} from '@pe/nest-kit';
import { Model } from 'mongoose';
import { SecondFactorService } from '../../2fa/services';
import { REGISTER_EVENT } from '../../users/constants';
import { UserDocument, RegisterEvent } from '../../users/interfaces';
import { FastifyResponse } from '../../common/interfaces';
import { UserService, RegistrationService } from '../../users/services';
import { RegisterDto } from '../../users/dto';
import { LOGIN_EVENT } from '../../auth/constants';
import {
  LoginEvent,
  RequestFingerprint,
} from '../../auth/interfaces';
import { SuspiciousActivityService } from '../../brute-force/services';
import { RequestParser } from '../../auth/services';
import { TokenCookieWriter } from '../../common';
import { SocialSchemaName } from '../schemas';
import { SocialModel } from '../models';
import { SocialTypeEnum } from '../enums';
import { SocialUserDto } from '../dtos';
import { SocialInterface } from '../interfaces';
import { SocialBlockedException } from '../exceptions';
import { environment } from '../../environments';

@Injectable()
export class SocialLoginService {
  constructor(
    private readonly eventDispatcher: EventDispatcher,
    private readonly suspiciousActivityService: SuspiciousActivityService,
    private readonly userService: UserService,
    private readonly registrationService: RegistrationService,
    private readonly secondFactorService: SecondFactorService,
    private readonly tokenCookieWriter: TokenCookieWriter,
    @InjectModel(SocialSchemaName) private readonly socialModel: Model<SocialModel>,
  ) { }

  public async create(data: SocialInterface): Promise<SocialModel> {
    return this.socialModel.create(data);
  }

  public async find(socialId: string, type: SocialTypeEnum): Promise<SocialModel> {
    return this.socialModel.findOne({ socialId, type });
  }

  public async getAllUserAccounts(userId: string): Promise<SocialModel[]> {
    return this.socialModel.find({ userId });
  }

  public async checkAccountAccess(id: string, userId: string): Promise<void> {
    if (!(await this.socialModel.findOne({ userId, _id: id }))) {
      throw new ForbiddenException('You are not owner of the account.');
    }
  }

  public async deleteSocialAccount(id: string): Promise<void> {
    await this.socialModel.findOneAndDelete({ _id: id });
  }

  public async blockSocialAccount(id: string): Promise<void> {
    await this.socialModel.findOneAndUpdate(
      { _id: id },
      {
        $set: {
          blocked: true,
        },
      },
    );
  }

  public async unblockSocialAccount(id: string): Promise<void> {
    await this.socialModel.findOneAndUpdate(
      { _id: id },
      {
        $set: {
          blocked: false,
        },
      },
    );
  }

  public async auth(
    data: SocialUserDto,
    req: any,
    response: FastifyResponse,
    type: SocialTypeEnum,
    state: string,
  ): Promise<any> {
    let socialData: SocialModel = await this.find(data.id, type);

    if (socialData && socialData.userId) {
      const user: UserDocument | undefined = await this.userService.findOneByEmail(socialData.email);

      if (!user) {
        await this.deleteSocialAccount(socialData._id);
      } else {
        return this.login(socialData, req, response, state);
      }
    }

    const result: {
      tokenObject?: TokensResultModel;
      user: UserDocument;
    } = await this.register(data, req, response, state);

    if (!result) {
      return;
    }

    socialData = await this.create({
      email: data.email,
      name: `${data.firstName} ${data.middleName} ${data.lastName}`,
      socialId: data.id,
      type,
      userId: result.user._id,
    });

    if (!result.tokenObject) {
      return this.login(socialData, req, response, state);
    } else {
      const queryParams: { [ key: string]: any} = {
        accessToken: result.tokenObject.accessToken,
        refreshToken: result.tokenObject.refreshToken,
        register: true,
      };

      response.status(302).redirect(`${environment.loginReturnUrl}?${this.buildReturnUrlParams(queryParams)}`);
    }
  }

  public async login(socialData: SocialModel, req: any, response: any, state: string): Promise<any> {
    if (state === 'register') {
      const loginQueryParams: { [ key: string]: any} = {
        error: 'REASON_ACCOUNT_ALREADY_EXISTS',
      };
      response.status(302).redirect(`${environment.loginReturnUrl}?${this.buildReturnUrlParams(loginQueryParams)}`);

      return;
    }

    if (socialData.blocked) {
      const socialQueryParams: { [ key: string]: any} = {
        error: 'REASON_SOCIAL_ACCOUNT_BLOCKED',
      };
      response.status(302).redirect(`${environment.loginReturnUrl}?${this.buildReturnUrlParams(socialQueryParams)}`);

      return;
    }

    const user: UserDocument | undefined = await this.userService.findOneByEmail(socialData.email);
    const parsedRequest: RequestFingerprint = RequestParser.parse(req);

    const loginEvent: LoginEvent =
      { user, parsedRequest, loginDto: { } as any, isSecurityQuestionDefined: false, isValidPassword: true };
    await this.eventDispatcher.dispatch(
      LOGIN_EVENT,
      loginEvent,
    );

    if (UserService.isSecondFactorAuth(user)) {
      await this.secondFactorService.generate(loginEvent.user, user.language);
      loginEvent.response && delete loginEvent.response.accessToken;
      loginEvent.response.isSecurityQuestionDefined = loginEvent.isSecurityQuestionDefined;
    }

    this.tokenCookieWriter.setTokenToCookie(
      response,
      loginEvent.response,
    );

    await this.suspiciousActivityService.removeUserFromBlockList(user._id);
    await this.suspiciousActivityService.clearLoginFailures(user._id, null);

    const queryParams: { [ key: string]: any} = {
      accessToken: loginEvent.response.accessToken,
      refreshToken: loginEvent.response.refreshToken,
      register: false,
    };

    response.status(302).redirect(`${environment.loginReturnUrl}?${this.buildReturnUrlParams(queryParams)}`);
  }

  public async register(data: SocialUserDto, request: any, response: any, state: string): Promise<{
    tokenObject?: TokensResultModel;
    user: UserDocument;
  }> {

    const user: UserDocument | undefined = await this.userService.findOneByEmail(data.email);
    if (!!user) {
      return { tokenObject: null, user };
    }

    if (state === 'login') {
      const queryParams: { [ key: string]: any} = {
        error: 'REASON_ACCOUNT_NOT_FOUND',
      };
      response.status(302).redirect(`${environment.loginReturnUrl}?${this.buildReturnUrlParams(queryParams)}`);

      return;
    }

    const parsedRequest: RequestFingerprint = RequestParser.parse(request);

    const registerDto: RegisterDto = {
      email: data.email,
      firstName: data.firstName,
      forceGeneratePassword: true,
      lastName: data.lastName,
    };

    const registerEvent: RegisterEvent = {
      isInvitedEmployee: false,
      isValid: true,
      parsedRequest,
      registerDto,
    };

    await this.eventDispatcher.dispatch(
      REGISTER_EVENT,
      registerEvent,
    );

    const tokenObject: TokensResultModel = await this.registrationService.register(registerDto, request);
    this.tokenCookieWriter.setTokenToCookie(response, tokenObject);

    return {
      tokenObject,
      user: await this.userService.findOneByEmail(data.email),
    };
  }

  private buildReturnUrlParams(params: { [ key: string]: any}): URLSearchParams {
    return new URLSearchParams(params);
  }
}
