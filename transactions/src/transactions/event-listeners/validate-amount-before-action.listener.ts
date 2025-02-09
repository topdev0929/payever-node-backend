import { Injectable } from '@nestjs/common';
import { EventListener } from '@pe/nest-kit';
import { PaymentActionEventEnum } from '../enum/events';
import { TransactionModel } from '../models';
import { ActionPayloadDto } from '../dto/action-payload';
import { PaymentActionsEnum } from '../enum';
import { ActionAmountValidatorsCollector } from '../services';
import { ActionWrapperDto } from '../dto/helpers';

@Injectable()
export class ValidateAmountBeforeActionListener {
  constructor(
    private readonly actionAmountValidatorsCollector: ActionAmountValidatorsCollector,
  ) { }

  @EventListener(PaymentActionEventEnum.PaymentActionBefore)
  public async validateAmountBeforeAction(
    transaction: TransactionModel,
    actionWrapper: ActionWrapperDto,
    skipValidation: boolean,
  ): Promise<void> {
    const allowedActions: string[] = [
      PaymentActionsEnum.Refund,
      PaymentActionsEnum.ShippingGoods,
    ];

    const action: string = actionWrapper.action;
    const actionPayload: ActionPayloadDto = actionWrapper.payloadDto;

    const allowedByAction: boolean = allowedActions.includes(action);
    const allowedByPayload: boolean =
      actionPayload.fields?.amount
      && !isNaN(Number(actionPayload.fields.amount))
      && (actionPayload.fields.payment_items ? actionPayload.fields.payment_items.length === 0 : true);

    if (!allowedByAction || !allowedByPayload || skipValidation) {
      return;
    }

    await this.actionAmountValidatorsCollector.validateAll(transaction, actionPayload.fields.amount, action);
  }
}
