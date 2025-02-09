import { Injectable, BadRequestException, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { v4 as uuid } from 'uuid';
import { SecurityQuestionModel } from '../models';
import { SecurityQuestionSchemaName } from '../schemas';
import { SecurityQuestionEnum } from '../enums';
import { SecurityQuestionDto, SecurityQuestionResponseDto, ValidateSecurityQuestionDto } from '../dto';
import { EventDispatcher, Hash, TokensResultModel } from '@pe/nest-kit';
import {
  FastifyRequestWithIpInterface,
  LocationService,
  RefreshTokenInterface,
  RequestFingerprint,
  RequestParser,
  TokenService,
} from '../../auth';
import { User, UserService } from '../../users';
import { SecurityQuestionEvent } from '../interfaces';
import { SECURITY_QUESTION_EVENT } from '../constants';

@Injectable()
export class SecurityQuestionService {
  constructor(
    @InjectModel(SecurityQuestionSchemaName)
    private readonly securityQuestionModel: Model<SecurityQuestionModel>,
    private readonly tokenService: TokenService,
    private readonly locationService: LocationService,
    private readonly eventDispatcher: EventDispatcher,
  ) { }

  public async getQuestions(): Promise<string[]> {
    return Object.keys(SecurityQuestionEnum).map((key: string) => SecurityQuestionEnum[key]);
  }

  public async getRelatedQuestionByUserId(userId: string): Promise<SecurityQuestionResponseDto> {
    const securityQuestionModel: SecurityQuestionModel = await this.findSecurityQuestionByUserId(userId);

    return { question: securityQuestionModel.question };
  }

  public async validate(
    dto: ValidateSecurityQuestionDto,
    request: FastifyRequestWithIpInterface,
  ): Promise<TokensResultModel> {
    const parsedRequest: RequestFingerprint = RequestParser.parse(request);
    const refreshToken: RefreshTokenInterface = await this.tokenService.getToken({ _id: dto.tokenId, revoked: false });

    const user: User = refreshToken.user as User;
    const securityQuestionModel = await this.findSecurityQuestionByUserId(user.id);
    dto.answer = this.generateHash(dto.answer);
    const isValidAnswer: boolean = securityQuestionModel.answer === dto.answer;

    const token = await this.tokenService.issueToken(
      user,
      parsedRequest,
      refreshToken.businessId,
    );

    const securityQuestionEvent: SecurityQuestionEvent =
      { user, parsedRequest, validateDto: dto, response: token, isValidAnswer };
    await this.eventDispatcher.dispatch(
      SECURITY_QUESTION_EVENT,
      securityQuestionEvent,
    );
    if (!isValidAnswer) {
      throw new UnauthorizedException('Security question answer is invalid');
    }

    await this.locationService.verifyLocation(user, parsedRequest);


    return securityQuestionEvent.response;
  }

  public async defineSecurityQuestion(dto: SecurityQuestionDto): Promise<void> {
    const answer: string = this.generateHash(dto.answer);
    await this.securityQuestionModel.updateOne({
      userId: dto.userId,
    }, {
      $set: {
        answer,
        question: dto.question,
        userId: dto.userId,
      },
      $setOnInsert: {
        _id: uuid(),
      },
    }, { upsert: true });

  }

  public async unDefineSecurityQuestion(userId: string): Promise<void> {
    const securityQuestionModel = await this.findSecurityQuestionByUserId(userId);
    if (securityQuestionModel) {
      await this.securityQuestionModel.remove({
        userId,
      });

    }

  }

  public async isSecurityQuestionDefined(userId: string): Promise<boolean> {
    const securityQuestionModel = await this.securityQuestionModel.findOne({ userId: userId });

    return !(!securityQuestionModel);
  }

  private async findSecurityQuestionByUserId(userId: string): Promise<SecurityQuestionModel> {
    const securityQuestionModel = await this.securityQuestionModel.findOne({ userId: userId });
    if (!securityQuestionModel) {
      throw new BadRequestException(
        `The security question for the userId=${userId} is not defined`
      );
    }

    return securityQuestionModel;
  }

  private generateHash(answer: string): string {
    return Hash.generate(answer.toLowerCase());
  }
}
