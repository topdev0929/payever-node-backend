import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';

import { SecurityQuestionAttemptSchemaName } from '../schemas';
import { SecurityQuestionAttemptModel } from '../models';

@Injectable()
export class SecurityQuestionService {
  constructor(@InjectModel(SecurityQuestionAttemptSchemaName)
  private readonly securityQuestionAttemptModel: SecurityQuestionAttemptModel) {
  }

  public async logAttempt(
    userId: string,
    ipAddress: string,
    success: boolean,
  ): Promise<any> {
    return this.securityQuestionAttemptModel.create({ user: userId, success, ipAddress });
  }

  public async clearLoginFailures(
    userId: string,
    ipAddress: string,
  ): Promise<void> {
    await this.securityQuestionAttemptModel
      .deleteMany({ success: false, $or: [{ ipAddress }, { user: userId }] });
  }
}
