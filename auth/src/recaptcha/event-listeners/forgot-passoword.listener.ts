import { Injectable } from '@nestjs/common';
import { EventListener } from '@pe/nest-kit';

import { ForgotPasswordEvent } from '../../users';
import { FORGOT_PASSWORD_EVENT } from '../../users/constants';
import { Recaptcha } from '../services/recaptcha.service';
import { BlockedException } from '../../brute-force/exceptions';
import { BanReasonsEnum } from '../../brute-force/enums/ban-reasons';

@Injectable()
export class ForgotPasswordListener {
  constructor(private readonly recaptchaService: Recaptcha) {
  }

  @EventListener(FORGOT_PASSWORD_EVENT)
  public async onForgetPasswordEvent(data: ForgotPasswordEvent): Promise<void> {
    const userId: string = data.user ? data.user._id : null;
    if (
      await this.recaptchaService.shouldVerify(userId, data.parsedRequest.ipAddress) &&
      !await this.recaptchaService.verify(data.forgotPasswordDto.recaptchaToken)
    ) {
      throw new BlockedException(BanReasonsEnum.REASON_NO_CAPTCHA);
    }
  }
}
