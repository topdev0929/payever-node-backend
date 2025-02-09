import { Injectable } from '@nestjs/common';
import { EventListener } from '@pe/nest-kit';
import { PaymentActionEventEnum } from '../enum/events';
import { TransactionModel } from '../models';
import { ActionItemValidatorsCollector } from '../services';
import { ActionPayloadDto } from '../dto/action-payload';
import { PaymentActionsEnum } from '../enum';
import { ActionWrapperDto } from '../dto/helpers';

@Injectable()
export class ValidateItemsBeforeActionListener {
  constructor(
    private readonly actionItemValidatorsCollector: ActionItemValidatorsCollector,
  ) { }

  @EventListener(PaymentActionEventEnum.PaymentActionBefore)
  public async validatePaymentItemsBeforeAction(
    transaction: TransactionModel,
    actionWrapper: ActionWrapperDto,
  ): Promise<void> {
    const allowedActions: string[] = [
      PaymentActionsEnum.Refund,
      PaymentActionsEnum.ShippingGoods,
    ];

    const action: string = actionWrapper.action;
    const actionPayload: ActionPayloadDto = actionWrapper.payloadDto;

    const allowedByAction: boolean = allowedActions.includes(action);
    const allowedByPayload: boolean =
      actionPayload.fields?.payment_items
      && Array.isArray(actionPayload.fields.payment_items)
      && actionPayload.fields.payment_items.length > 0;

    if (!allowedByAction || !allowedByPayload) {
      return;
    }

    for (const item of actionPayload.fields.payment_items) {
      await this.actionItemValidatorsCollector.validateAll(transaction, item, action);
    }
  }
}
