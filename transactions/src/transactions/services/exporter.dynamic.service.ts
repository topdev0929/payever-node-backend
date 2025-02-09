import { Injectable, Logger, OnApplicationBootstrap } from '@nestjs/common';
import { BusinessService } from '@pe/business-kit';
import { RabbitMqClient } from '@pe/nest-kit';
import { spawn } from 'child_process';
import { RabbitChannels, RabbitExchangesEnum } from '../../enums';
import { environment } from '../../environments';
import { ExportTransactionsSettingsDto } from '../dto';
const CONSUMER_SCRIPT_PATH: string = 'deploy/export-dynamic-consumer.sh';

@Injectable()
export class ExporterDynamicService {
  constructor(
    private readonly rabbitClient: RabbitMqClient,
    private readonly logger: Logger,
  ) { }


  public async executeInitial(): Promise<void> {
    // check if current application is a dynamic consumer

    if (
      !environment.rabbitmq.rabbitTransactionsQueueName ||
      !environment.rabbitmq.rabbitExportId ||
      !environment.rabbitmq.dataPayload) {
      return;
    }
    let payload: ExportTransactionsSettingsDto;
    try {
      payload = JSON.parse(environment.rabbitmq.dataPayload);
    } catch (e) { }
    if (payload) {
      await this.rabbitClient.send(
        {
          channel: '1',
          exchange: RabbitExchangesEnum.transactionsExportDynamic,
        },
        {
          name: RabbitChannels.TransactionsExportDynamic,
          payload,
        },
      );
    }
    /* eslint @typescript-eslint/unbound-method: 0 */
    setTimeout(process.exit, 5000);
  }


  public async startConsumer(
    data: ExportTransactionsSettingsDto,
  ): Promise<any> {
    const script: any = spawn(CONSUMER_SCRIPT_PATH, {
      env: {
        DATA_PAYLOAD: JSON.stringify(data),
        RABBIT_EXPORT_ID: data.userId ? data.userId : data.businessId ? data.businessId : data.sendEmailTo,
        ...process.env,
      },
    });

    script.stdout.on('data', (dataRes: any) => {
      this.logger.log(`Spawn data : ${dataRes}`);
    });

    script.stderr.on('data', (dataErr: any) => {
      this.logger.log(`Spawn error : ${dataErr}`);
    });

    script.on('close', (code: any) => {
      this.logger.log(`Spawn close with code : ${code}`);
    });
  }
}
