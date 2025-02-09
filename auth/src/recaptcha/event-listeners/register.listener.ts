import { Injectable } from '@nestjs/common';
import { EventListener } from '@pe/nest-kit';

import { Recaptcha } from '../services/recaptcha.service';
import { BlockedException } from '../../brute-force/exceptions';
import { BanReasonsEnum } from '../../brute-force/enums/ban-reasons';
import { REGISTER_EVENT } from '../../users/constants';
import { RegisterEvent } from '../../users/interfaces';

@Injectable()
export class RegisterListener {
  constructor(private readonly recaptchaService: Recaptcha) {
  }

  @EventListener(REGISTER_EVENT)
  public async onRegisterEvent(data: RegisterEvent): Promise<void> {
    if (data.isInvitedEmployee || data.isRpc) {
      return;
    }

    if (
      await this.recaptchaService.shouldVerify(null, data.parsedRequest.ipAddress) &&
      !await this.recaptchaService.verify(data.registerDto.recaptchaToken)
    ) {
      throw new BlockedException(BanReasonsEnum.REASON_NO_CAPTCHA);
    }
  }
}
