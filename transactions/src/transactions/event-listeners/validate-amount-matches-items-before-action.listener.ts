import { Injectable, BadRequestException } from '@nestjs/common';
import { EventListener } from '@pe/nest-kit';
import { PaymentActionEventEnum } from '../enum/events';
import { TransactionModel } from '../models';
import { ActionPayloadDto } from '../dto/action-payload';
import { TransactionCartItemInterface } from '../interfaces/transaction';
import { PaymentActionsEnum } from '../enum';
import { ActionWrapperDto } from '../dto/helpers';

@Injectable()
export class ValidateAmountMatchesItemsBeforeActionListener {
  @EventListener(PaymentActionEventEnum.PaymentActionBefore)
  public async validateAmountMatchesItemsBeforeAction(
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
    const allowedByAmountPayload: boolean =
      actionPayload.fields?.amount
      && !isNaN(Number(actionPayload.fields.amount));

    const allowedByItemsPayload: boolean =
      actionPayload.fields?.payment_items
      && Array.isArray(actionPayload.fields.payment_items)
      && actionPayload.fields.payment_items.length > 0;

    if (!allowedByAction || !allowedByAmountPayload || !allowedByItemsPayload) {
      return;
    }

    let totalItemsAmount: number = actionPayload.fields.payment_items.
      reduce((total: number, item: TransactionCartItemInterface) => total + item.price * item.quantity, 0);
    totalItemsAmount = Math.round((totalItemsAmount + Number.EPSILON) * 100) / 100;
    let totalAmountToCheck: number =
      totalItemsAmount + (actionPayload.fields.delivery_fee ? actionPayload.fields.delivery_fee : 0);
    totalAmountToCheck = Math.round((totalAmountToCheck + Number.EPSILON) * 100) / 100;

    if (actionPayload.fields.amount !== totalAmountToCheck) {
      throw new BadRequestException('Amount does not match items total');
    }
  }
}
