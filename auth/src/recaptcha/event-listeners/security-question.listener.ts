import { Injectable } from '@nestjs/common';
import { EventListener } from '@pe/nest-kit';
import { Recaptcha } from '../services/recaptcha.service';
import { BlockedException } from '../../brute-force/exceptions';
import { BanReasonsEnum } from '../../brute-force/enums/ban-reasons';
import { SECURITY_QUESTION_EVENT } from '../../security-question/constants';
import { SecurityQuestionEvent } from '../../security-question/interfaces';

@Injectable()
export class SecurityQuestionListener {
  constructor(private readonly recaptchaService: Recaptcha) {
  }

  @EventListener({ eventName: SECURITY_QUESTION_EVENT })
  public async onSecurityQuestionEvent(data: SecurityQuestionEvent): Promise<void> {
    if (
      !await this.recaptchaService.verify(data.validateDto.recaptchaToken)
    ) {
      throw new BlockedException(BanReasonsEnum.REASON_NO_CAPTCHA);
    }
  }
}
