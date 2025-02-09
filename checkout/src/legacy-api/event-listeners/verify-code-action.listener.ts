import { BadRequestException, ForbiddenException, Injectable } from '@nestjs/common';
import { EventListener } from '@pe/nest-kit';
import { LegacyApiEventEnum, PaymentActionsEnum, VerifyTypeEnum } from '../enum';
import { PaymentCodeModel, PaymentModel } from '../models';
import { PaymentCodeService } from '../services';
import { ApiCallService } from '../../common/services';
import { ApiCallModel } from '../../common/models';
import { VerifyActionDto } from '../dto/request/v1';

@Injectable()
export class VerifyCodeActionListener {
  constructor(
    private readonly apiCallService: ApiCallService,
    private readonly paymentCodeService: PaymentCodeService,
  ) { }

  @EventListener(LegacyApiEventEnum.beforePaymentAction)
  public async verifyPaymentCode(
    payment: PaymentModel,
    action: string,
    actionDto: VerifyActionDto,
  ): Promise<void> {
    if (action !== PaymentActionsEnum.VERIFY || !payment.api_call_id) {
      return;
    }

    const apiCall: ApiCallModel = await this.apiCallService.findApiCallById(payment.api_call_id);
    if (!apiCall || !apiCall.verify_type) {
      return;
    }

    switch (apiCall.verify_type) {
      case VerifyTypeEnum.code:
        return this.verifyByCode(apiCall, actionDto);
      case VerifyTypeEnum.id:
        return this.validateByID(actionDto);
      default:
        return;
    }
  }

  @EventListener(LegacyApiEventEnum.afterPaymentAction)
  public async updatePaymentCode(
    payment: PaymentModel,
    action: string,
  ): Promise<void> {
    if (action !== PaymentActionsEnum.VERIFY || !payment.api_call_id) {
      return;
    }

    const apiCall: ApiCallModel = await this.apiCallService.findApiCallById(payment.api_call_id);
    if (!apiCall || !apiCall.verify_type || apiCall.verify_type !== VerifyTypeEnum.code) {
      return;
    }

    await this.paymentCodeService.setPaymentCodeAsVerified(apiCall);
  }

  private async verifyByCode(
    apiCall: ApiCallModel,
    actionDto: VerifyActionDto,
  ): Promise<void> {
    const paymentCode: PaymentCodeModel = await this.paymentCodeService.getPaymentCodeByApiCall(apiCall);

    if (paymentCode?.code !== actionDto?.code) {
      throw new ForbiddenException('Wrong code');
    }
  }

  private async validateByID(
    actionDto: VerifyActionDto,
  ): Promise<void> {
    if (actionDto?.verified === null || actionDto?.verified === undefined) {
      throw new BadRequestException('"verified" param is missing');
    }
  }
}
