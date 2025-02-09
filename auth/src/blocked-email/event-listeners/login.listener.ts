import { Injectable } from '@nestjs/common';
import { EventListener } from '@pe/nest-kit';

import { LoginEvent } from '../../auth/interfaces';
import { LOGIN_EVENT } from '../../auth/constants';
import { BlockEmailService } from '../services';
import { BanReasonsEnum } from '../enums/ban-reasons';
import { BlockedException } from '../exceptions';

@Injectable()
export class LoginListener {
  constructor(
    private readonly blockEmailService: BlockEmailService,
  ) {
  }

  @EventListener({
    eventName: LOGIN_EVENT,
    priority: 100,
  })
  public async onLoginEvent(data: LoginEvent): Promise<void> {
    const userEmail: string = data.user ? data.user.email : null;

    if (await this.blockEmailService.checkBlocked(userEmail)) {
      throw new BlockedException(BanReasonsEnum.REASON_EMAIL_BAN_LOGIN);
    }
  }
}
