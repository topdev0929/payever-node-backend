import { Injectable } from '@nestjs/common';
import { TransactionUnpackedDetailsInterface } from '../interfaces/transaction';
import { ThirdPartyCallerService } from './third-party-caller.service';
import { DownloadResourceDto } from '../dto';
import { HistoryEventActionCompletedInterface, HistoryEventUserInterface } from '../interfaces/history-event-message';
import { PaymentActionEventEnum } from '../enum/events';
import { AccessTokenPayload, EventDispatcher } from '@pe/nest-kit';
import { HistoryActionsEnum } from '../enum';

@Injectable()
export class ContractService {
  constructor(
    private readonly thirdPartyCaller: ThirdPartyCallerService,
    private readonly eventDispatcher: EventDispatcher,
  ) { }

  public async downloadContractWithHistory(
    transaction: TransactionUnpackedDetailsInterface,
    user: AccessTokenPayload,
  ): Promise<DownloadResourceDto> {
    const result: DownloadResourceDto =
      await this.thirdPartyCaller.downloadContract(transaction);

    const message: HistoryEventActionCompletedInterface = {
      action: HistoryActionsEnum.contractDownloaded,
      data: {
        amount: transaction.total,
        payment_status: transaction.status,
        user: this.prepareUserData(user),
      },
      payment: {
        id: transaction.original_id,
        uuid: transaction.uuid,
      },
    };

    this.eventDispatcher.dispatch(
      PaymentActionEventEnum.PaymentActionCompleted,
      transaction,
      message,
    ).catch();

    return result;
  }

  private prepareUserData(
    user: AccessTokenPayload,
  ): HistoryEventUserInterface {
    if (!user) {
      return null;
    }

    return {
      email: user.email,
      first_name: user.firstName,
      id: user.id,
      last_name: user.lastName,
    };
  }
}
