import { Injectable } from '@nestjs/common';
import { EventListener } from '@pe/nest-kit';
import { VerifyTypeEnum } from '../enum';
import { PaymentCodeService } from '../services';
import { ApiCallEventEnum } from '../../common/enum';
import { ApiCallModel } from '../../common/models';

@Injectable()
export class GenerateVerifyCodeApiCallListenerService {
  constructor(
    private readonly paymentCodeService: PaymentCodeService,
  ) { }

  @EventListener(ApiCallEventEnum.apiCallCreated)
  public async generatePinCode(
    apiCall: ApiCallModel,
  ): Promise<void> {
    if (!apiCall.verify_type || apiCall.verify_type !== VerifyTypeEnum.code) {
      return;
    }

    await this.paymentCodeService.createPaymentCode(apiCall);
  }
}
