import { Injectable } from '@nestjs/common';
import { EventListener } from '@pe/nest-kit';

import { LoginEvent } from '../../auth/interfaces';
import { LOGIN_EVENT } from '../../auth/constants';
import { Recaptcha } from '../services/recaptcha.service';
import { BlockedException } from '../../brute-force/exceptions';
import { BanReasonsEnum } from '../../brute-force/enums/ban-reasons';

@Injectable()
export class LoginListener {
  constructor(private readonly recaptchaService: Recaptcha) {
  }

  @EventListener({
    eventName: LOGIN_EVENT,
    priority: 50,
  })
  public async onLoginEvent(data: LoginEvent): Promise<void> {
    const userId: string = data.user ? data.user._id : null;
    if (
      await this.recaptchaService.shouldVerify(userId, data.parsedRequest.ipAddress) &&
      !await this.recaptchaService.verify(data.loginDto.recaptchaToken)
    ) {
      throw new BlockedException(BanReasonsEnum.REASON_NO_CAPTCHA);
    }
  }
}
