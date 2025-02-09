import { Controller, Logger } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { RabbitChannels, RabbitRoutingKeys } from '../../enums';
import { ArchivedTransactionService } from '../services';

@Controller()
export class AnonymizeTransactionsConsumer {
  constructor(
    private readonly archivedTransactionService: ArchivedTransactionService,
    private readonly logger: Logger,
  ) { }

  @MessagePattern({
    channel: RabbitChannels.TransactionsAnonymize,
    name: RabbitRoutingKeys.InternalTransactionAnonymize,
  })
  public async onArchiveTransactionEvent(data: { uuid: string}): Promise<void> {
    this.logger.log({
      data: data,
      text: 'Received archive transactions event',
    });

    await this.archivedTransactionService.anonymizeOldTransaction(data.uuid);
  }

}

