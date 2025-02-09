import { Injectable } from '@nestjs/common';
import { EventListener } from '@pe/nest-kit';
import { LegacyApiEventEnum, PaymentActionsEnum, VerifyTypeEnum } from '../enum';
import { PaymentModel } from '../models';
import { ApiCallService } from '../../common/services';
import { ApiCallModel } from '../../common/models';
import { VerifyActionDto } from '../dto/request/v1';

@Injectable()
export class ConvertCustomVerifyActionListener {
  constructor(
    private readonly apiCallService: ApiCallService,
  ) { }

  @EventListener(LegacyApiEventEnum.beforePaymentAction)
  public async verifyPaymentAction(
    payment: PaymentModel,
    action: string,
    actionDto: VerifyActionDto,
  ): Promise<void> {
    if (action !== PaymentActionsEnum.VERIFY || !payment.api_call_id || !actionDto || !actionDto.custom) {
      return;
    }

    const apiCall: ApiCallModel = await this.apiCallService.findApiCallById(payment.api_call_id);
    if (!apiCall || !apiCall.verify_type || apiCall.verify_type !== VerifyTypeEnum.custom) {
      return;
    }

    Object.assign(
      actionDto,
      {
        ...actionDto.custom,
        custom: undefined,
        pin: actionDto.pin,
        seller: actionDto.seller,
      },
    );
  }
}
