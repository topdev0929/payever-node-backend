import { EventListener } from '@pe/nest-kit';
import { PaymentActionEventEnum } from '../enum/events';
import { TransactionHistoryService } from '../services';
import { TransactionModel } from '../models';
import { HistoryActionsEnum } from '../enum';
import { Injectable } from '@nestjs/common';

@Injectable()
export class UpdateStatusInHistoryListener {
  constructor (
    private readonly historyService: TransactionHistoryService,
  ) { }

  @EventListener(PaymentActionEventEnum.PaymentActionStatusChanged)
  public async paymentActionStatusChanged(
    transaction: TransactionModel,
    newStatus: string,
  ): Promise<void> {
    await this.historyService.processHistoryRecord(
      transaction,
      HistoryActionsEnum.statusChanged,
      new Date(),
      {
        payment_status: newStatus,
      },
    );
  }

}
