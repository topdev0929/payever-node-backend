import { InjectModel } from '@nestjs/mongoose';
import { Controller, HttpCode, HttpStatus, Post, Query, Req } from '@nestjs/common';

import { Recaptcha } from '../services/recaptcha.service';
import { UserModel } from '../../users/models/user.model';
import { UserSchemaName } from '../../users/schemas';
import { User } from '../../users/interfaces';
import { ApiResponse } from '@nestjs/swagger';
import { TokensResultModel } from '@pe/nest-kit';
import { FastifyRequestWithIpInterface, RequestFingerprint } from '../../auth/interfaces';
import { RequestParser } from '../../auth/services';

@Controller('api/recaptcha')
export class RecaptchaController {
  constructor(
    @InjectModel(UserSchemaName) private readonly userModel: UserModel,
    private readonly recaptchaService: Recaptcha,
  ) { }

  @Post()
  @HttpCode(HttpStatus.OK)
  @ApiResponse({ status: HttpStatus.OK, type: TokensResultModel, description: 'Should captcha be verified' })
  public async shouldVerify(
    @Query('email') email: string,
    @Req() request: FastifyRequestWithIpInterface,
  ): Promise<boolean> {
    const parsedRequest: RequestFingerprint = RequestParser.parse(request);
    const userEntity: User = await this.userModel.findOne({ email}).exec();
    const userId: string = userEntity ? userEntity._id : null;

    return this.recaptchaService.shouldVerify(userId, parsedRequest.ipAddress);
  }
}
