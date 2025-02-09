import { Injectable, Logger } from '@nestjs/common';

import { Cron } from '@pe/cron-kit';
import { BusinessModel, BusinessSchemaName } from '../../business';
import { TransactionModel } from '../../transactions/models';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { RabbitMqClient } from '@pe/nest-kit';
import { RabbitRoutingKeys, RabbitExchangesEnum } from '../../enums';
import { ArchivedTransactionService } from '../services';

@Injectable()
export class AnonymizeOldTransactionsCron {
  constructor(
    @InjectModel(BusinessSchemaName) private readonly businessModel: Model<BusinessModel>,
    private readonly rabbitClient: RabbitMqClient,
    private readonly archivedTransactionService: ArchivedTransactionService,
  ) { }

  @Cron('0 0 * * *', { name: 'archiveOldTransactions' })
  public async archiveOldTransactions(): Promise<void> {
    Logger.log('Start anonymize old transactions');

    const businesses: BusinessModel[] = await this.businessModel.find({ isDeleted: { $ne: true}});
    for (const business of businesses) {

      const transactions: TransactionModel[] =
        await this.archivedTransactionService.getOldBusinessTransactions(business);

      Logger.log(`anonymize ${transactions.length} transactions for business: ${business._id}`);
      for (const transaction of transactions) {
        await this.rabbitClient.send(
          {
            channel: RabbitRoutingKeys.InternalTransactionAnonymize,
            exchange: RabbitExchangesEnum.transactionsAnonymize,
          },
          {
            name: RabbitRoutingKeys.InternalTransactionAnonymize,
            payload: {
              uuid: transaction.uuid,
            },
          },
        );
      }
    }

    Logger.log('Anonymize old transactions finished');
  }
}
