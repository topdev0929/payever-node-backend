import { Controller } from '@nestjs/common';
import { plainToClass } from 'class-transformer';
import { MessagePattern } from '@nestjs/microservices';
import { ExportTransactionsSettingsDto } from '../dto';
import { ExporterService } from '../services';
import { environment } from '../../environments';
import { RabbitChannels } from '../../enums';

@Controller()
export class ExportTransactionsTriggerConsumer {
  constructor(
    private readonly exporterService: ExporterService,
  ) { }

  @MessagePattern({
    channel: environment.rabbitmq.rabbitTransactionsQueueName,
    name: RabbitChannels.TransactionsExportDynamic,
    routingKey: '1',
  })
  public async onExportTransactionEvent(data: any): Promise<void> {

    const settings: ExportTransactionsSettingsDto = plainToClass(ExportTransactionsSettingsDto, data);

    await this.exporterService.exportTransactionsViaLink(settings);
  }

}

