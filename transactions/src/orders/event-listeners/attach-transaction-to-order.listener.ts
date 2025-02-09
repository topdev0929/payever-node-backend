import { Injectable } from '@nestjs/common';
import { EventListener } from '@pe/nest-kit';
import { OrderService } from '../services';
import { TransactionEventEnum } from '../../transactions/enum/events';
import { TransactionModel } from '../../transactions/models';

@Injectable()
export class AttachTransactionToOrderListener {
  constructor(
    private readonly orderService: OrderService,
  ) {
  }

  @EventListener(TransactionEventEnum.TransactionCreated)
  public async onTransactionCreated(
    transaction: TransactionModel,
  ): Promise<void> {
    await this.attachTransactionToOrder(transaction.uuid, transaction.order_id);
  }

  @EventListener(TransactionEventEnum.TransactionUpdated)
  public async onTransactionUpdated(
    transaction: TransactionModel,
  ): Promise<void> {
    await this.attachTransactionToOrder(transaction.uuid, transaction.order_id);
  }

  private async attachTransactionToOrder(transactionId: string, orderId?: string): Promise<void> {
    if (!orderId) {
      return;
    }

    await this.orderService.attachTransactionToOrder(orderId, transactionId);
  }
}
