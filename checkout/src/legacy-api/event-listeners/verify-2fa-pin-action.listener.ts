import { ForbiddenException, Injectable } from '@nestjs/common';
import { EventListener } from '@pe/nest-kit';
import { LegacyApiEventEnum, PaymentActionsEnum, TwoFactorTypeEnum } from '../enum';
import { Payment2faPinModel, PaymentModel } from '../models';
import { Payment2faPinService } from '../services';
import { ApiCallService } from '../../common/services';
import { ApiCallModel } from '../../common/models';
import { VerifyActionDto } from '../dto/request/v1';

@Injectable()
export class Verify2faPinActionListener {
  constructor(
    private readonly apiCallService: ApiCallService,
    private readonly payment2faPinService: Payment2faPinService,
  ) { }

  @EventListener(LegacyApiEventEnum.beforePaymentAction)
  public async verifyPayment2faPin(
    payment: PaymentModel,
    action: string,
    actionDto: VerifyActionDto,
  ): Promise<void> {
    if (action !== PaymentActionsEnum.VERIFY || !payment.api_call_id) {
      return;
    }

    const apiCall: ApiCallModel = await this.apiCallService.findApiCallById(payment.api_call_id);
    if (!apiCall
      || !apiCall.verify_two_factor
      || apiCall.verify_two_factor === TwoFactorTypeEnum.none
      || !apiCall.two_factor_triggered
    ) {
      return;
    }

    const payment2faPin: Payment2faPinModel = await this.payment2faPinService.getUnverifiedPayment2faPin(payment);
    if (!payment2faPin) {
      return;
    }

    if (payment2faPin?.pin !== actionDto?.pin) {
      throw new ForbiddenException('Wrong 2fa pin');
    }
  }

  @EventListener(LegacyApiEventEnum.afterPaymentAction)
  public async updatePayment2faPin(
    payment: PaymentModel,
    action: string,
  ): Promise<void> {
    if (action !== PaymentActionsEnum.VERIFY || !payment.api_call_id) {
      return;
    }

    const apiCall: ApiCallModel = await this.apiCallService.findApiCallById(payment.api_call_id);
    if (!apiCall
      || !apiCall.verify_two_factor
      || apiCall.verify_two_factor === TwoFactorTypeEnum.none
      || !apiCall.two_factor_triggered
    ) {
      return;
    }

    await this.payment2faPinService.setPaymentPinAsVerified(payment);
  }
}
