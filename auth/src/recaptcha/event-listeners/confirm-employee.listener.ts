import { Injectable } from '@nestjs/common';
import { EventListener } from '@pe/nest-kit';

import { CONFIRM_EMPLOYEE_EVENT } from '../../employees/constants';
import { ConfirmEmployeeEvent } from '../../employees/interfaces';
import { Recaptcha } from '../services/recaptcha.service';
import { BlockedException } from '../../brute-force/exceptions';
import { BanReasonsEnum } from '../../brute-force/enums/ban-reasons';

@Injectable()
export class ConfirmEmployeeListener {
  constructor(private readonly recaptchaService: Recaptcha) {
  }

  @EventListener(CONFIRM_EMPLOYEE_EVENT)
  public async onConfirmEmployeeEvent(data: ConfirmEmployeeEvent): Promise<void> {
    const userId: string = data.user ? data.user._id : null;
    if (
      await this.recaptchaService.shouldVerify(userId, data.parsedRequest.ipAddress) &&
      !await this.recaptchaService.verify(data.recaptchaToken)
    ) {
      throw new BlockedException(BanReasonsEnum.REASON_NO_CAPTCHA);
    }
  }
}
