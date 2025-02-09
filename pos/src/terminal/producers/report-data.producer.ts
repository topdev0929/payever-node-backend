import { Injectable } from '@nestjs/common';
import { RabbitMqClient } from '@pe/nest-kit';
import { MailReportInterface } from '../interfaces';

@Injectable()
export class ReportDataEventProducer {
  constructor(private readonly rabbitClient: RabbitMqClient) { }

  public async produceReportDataPrepared(mailReport: MailReportInterface[]): Promise<void> {
    await this.rabbitClient.send(
      {
        channel: 'pos.active.event.report-data.prepared',
        exchange: 'async_events',
      },
      {
        name: 'pos.active.event.report-data.prepared',
        payload: mailReport,
      },
    );
  }
}
