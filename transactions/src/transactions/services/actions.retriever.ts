import { Injectable, Logger } from '@nestjs/common';
import { PaymentActionsEnum } from '../enum';
import { ActionDescriptionHelper } from '../helpers';
import { ActionItemInterface } from '../interfaces';
import { TransactionUnpackedDetailsInterface } from '../interfaces/transaction';
import { ThirdPartyCallerService } from './third-party-caller.service';

@Injectable()
export class ActionsRetriever {

  constructor(
    private readonly thirdPartyCallerService: ThirdPartyCallerService,
    private readonly logger: Logger,
  ) { }

  public async retrieve(unpackedTransaction: TransactionUnpackedDetailsInterface): Promise<ActionItemInterface[]> {
    let actions: ActionItemInterface[];

    try {
      actions = await this.thirdPartyCallerService.getActionsList(unpackedTransaction);
    } catch (e) {
      this.logger.error(
        {
          error: e.message,
          message: `Error occurred while getting transaction actions`,
        },
        e.stack,
        ActionsRetriever.name,
      );
      actions = [];
    }

    return actions;
  }

  public retrieveFakeActions(unpackedTransaction: TransactionUnpackedDetailsInterface): ActionItemInterface[] {
    switch (unpackedTransaction.status) {
      case 'STATUS_ACCEPTED':
        return [
          {
            action: 'refund',
            description: ActionDescriptionHelper['refund' as PaymentActionsEnum],
            enabled: true,
            isOptional: false,
            partialAllowed: false,
          },
          {
            action: 'cancel',
            description: ActionDescriptionHelper['cancel' as PaymentActionsEnum],
            enabled: true,
            isOptional: false,
            partialAllowed: false,
          },
          {
            action: 'shipping_goods',
            description: ActionDescriptionHelper['shipping_goods' as PaymentActionsEnum],
            enabled: true,
            isOptional: false,
            partialAllowed: false,
          },
        ];
      case 'STATUS_PAID':
      case 'STATUS_REFUNDED':
      case 'STATUS_CANCELLED':
        return [];
      default:
        return [];
    }
  }
}
