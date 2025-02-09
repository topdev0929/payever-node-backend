import { Controller } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';

import { MessageBusChannelsEnum } from '../../environments/rabbitmq';
import { TransactionsPaymentExportDto } from '../dto/transactions-event';
import { MessageBusEventsEnum } from '../enums';
import { EtlService } from '../services';

@Controller()
export class TransactionMessagesConsumer {
  constructor(
    private readonly etlService: EtlService,
  ) { }

  @MessagePattern({
    channel: MessageBusChannelsEnum.statistics,
    name: MessageBusEventsEnum.TransactionsPaymentExport,
  })
  public async onTransactionsPaymentExportEvent(data: TransactionsPaymentExportDto): Promise<void> {    
    await this.etlService.updateCustomerData(data);
  }
}
