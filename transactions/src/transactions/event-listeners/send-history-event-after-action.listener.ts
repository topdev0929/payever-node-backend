import { Injectable } from '@nestjs/common';
import { AccessTokenPayload, EventDispatcher, EventListener } from '@pe/nest-kit';
import { PaymentActionEventEnum } from '../enum/events';
import { TransactionModel } from '../models';
import { ActionPayloadDto } from '../dto/action-payload';
import { HistoryEventActionCompletedInterface, HistoryEventUserInterface } from '../interfaces/history-event-message';
import { TransactionCartItemInterface } from '../interfaces/transaction';
import { PaymentActionsEnum } from '../enum';
import { ActionWrapperDto } from '../dto/helpers';

@Injectable()
export class SendHistoryEventAfterActionListener {
  constructor(
    private readonly eventDispatcher: EventDispatcher,
  ) { }

  @EventListener(PaymentActionEventEnum.PaymentActionAfter)
  public async sendHistoryEventAfterSuccessAction(
    transaction: TransactionModel,
    actionWrapper: ActionWrapperDto,
    isIdempotentReplayed: boolean = false,
  ): Promise<void> {
    if (isIdempotentReplayed) {
      return;
    }

    await this.doSendHistory(transaction, actionWrapper);
  }

  @EventListener(PaymentActionEventEnum.PaymentActionFailed)
  public async sendHistoryEventAfterFailedAction(
    transaction: TransactionModel,
    actionWrapper: ActionWrapperDto,
  ): Promise<void> {
    await this.doSendHistory(transaction, actionWrapper);
  }

  private async doSendHistory(
    transaction: TransactionModel,
    actionWrapper: ActionWrapperDto,
  ): Promise<void> {
    const action: string = actionWrapper.action;
    const actionPayload: ActionPayloadDto = actionWrapper.payloadDto;
    const user: AccessTokenPayload = actionWrapper.user;

    const message: HistoryEventActionCompletedInterface = {
      action,
      data: {
        amount: this.getAmountFromPayload(transaction, action, actionPayload),
        delivery_fee: actionPayload.fields ? actionPayload.fields.delivery_fee : 0,
        idempotency_key: actionWrapper.idempotencyKey,
        items: this.getPaymentItemsFromPayload(actionPayload),
        payment_status: transaction.status,
        reason: this.getReasonFromPayload(actionPayload),
        reference: this.getReferenceFromPayload(actionPayload),
        user: this.prepareUserData(actionPayload, user),

        error: actionWrapper.error,
        execution_time: actionWrapper.executionTime,
        is_external_api_call: actionWrapper.isExternalApiCall,
        status: actionWrapper.status,
      },
      payment: {
        id: transaction.original_id,
        uuid: transaction.uuid,
      },
    };

    await this.eventDispatcher.dispatch(
      PaymentActionEventEnum.PaymentActionCompleted,
      transaction,
      message,
    );
  }

  private prepareUserData(
    actionPayload: ActionPayloadDto,
    user?: AccessTokenPayload,
  ): HistoryEventUserInterface {
    if (actionPayload?.fields?.seller) {
      return actionPayload?.fields?.seller;
    }

    if (user) {
      return {
        email: user.email,
        first_name: user.firstName,
        id: user.id,
        last_name: user.lastName,
      };
    }

    return null;
  }

  private getAmountFromPayload(transaction: TransactionModel, action: string, actionPayload: ActionPayloadDto): number {
    let amount: number = actionPayload.fields?.amount ? actionPayload.fields.amount : null;

    if (amount) {
      return amount;
    }

    switch (action) {
      case PaymentActionsEnum.Refund:
      case PaymentActionsEnum.Return:
        amount = actionPayload.fields?.payment_return?.amount ? actionPayload.fields.payment_return.amount : null;
        break;
      case PaymentActionsEnum.ShippingGoods:
        amount = actionPayload.fields?.capture_funds?.amount
          ? parseFloat(actionPayload.fields.capture_funds.amount)
          : null;
        break;
      case PaymentActionsEnum.Cancel:
        amount = actionPayload.fields?.payment_cancel?.amount ? actionPayload.fields.payment_cancel.amount : null;
        break;
    }

    if (amount) {
      return amount;
    }

    const payloadItems: TransactionCartItemInterface[] = actionPayload.fields?.payment_items;
    if (payloadItems && payloadItems.length) {
      amount = payloadItems.reduce(
        (accum: number, item: TransactionCartItemInterface) => {
          const itemTotal: number = item.price * item.quantity;

          return accum + itemTotal;
        },
        0,
      );
    }

    return amount ? amount : transaction.total;
  }

  private getReferenceFromPayload(
    actionPayload: ActionPayloadDto,
  ): string {
    return actionPayload.fields?.reference ? actionPayload.fields.reference : null;
  }

  private getPaymentItemsFromPayload(
    actionPayload: ActionPayloadDto,
  ): TransactionCartItemInterface[] {
    return actionPayload.fields?.payment_items ? actionPayload.fields.payment_items : null;
  }

  private getReasonFromPayload(actionPayload: ActionPayloadDto): string {
    let reason: string = actionPayload.fields?.reason ? actionPayload.fields.reason : null;

    if (reason) {
      return reason;
    }

    reason = actionPayload.fields?.payment_return?.reason
      ? actionPayload.fields.payment_return.reason
      : actionPayload.fields?.payment_cancel?.reason
        ? actionPayload.fields.payment_cancel.reason
        : null;

    return reason ? reason : '';
  }
}
