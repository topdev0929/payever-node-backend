import { Injectable } from '@nestjs/common';
import { EventListener } from '@pe/nest-kit';

import { LoginEvent } from '../../auth/interfaces';
import { LOGIN_EVENT } from '../../auth/constants';
import { SecurityQuestionService } from '../services';

@Injectable()
export class LoginListener {
  constructor(
    private readonly securityQuestionService: SecurityQuestionService,
  ) {
  }

  @EventListener({
    eventName: LOGIN_EVENT,
    priority: 110,
  })
  public async isSecurityQuestionDefined(data: LoginEvent): Promise<void> {

    data.isSecurityQuestionDefined =
      await this.securityQuestionService.isSecurityQuestionDefined(data.user?._id);
  }
}
