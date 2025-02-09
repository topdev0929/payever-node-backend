import { Injectable } from '@nestjs/common';
import { RabbitMqClient } from '@pe/nest-kit';
import { WidgetsBusinessDataInterface } from '../interfaces';

@Injectable()
export class WidgetsEventsProducer {
  constructor(
    private readonly rabbitClient: RabbitMqClient,
  ) { }

  public async produceWidgetsReportDataPreparedEvent(data: WidgetsBusinessDataInterface[]): Promise<void> {
    await this.rabbitClient.send(
      {
        channel: 'widgets.event.report-data.prepared',
        exchange: 'async_events',
      },
      {
        name: 'widgets.event.report-data.prepared',
        payload: data,
      },
    );
  }
}
