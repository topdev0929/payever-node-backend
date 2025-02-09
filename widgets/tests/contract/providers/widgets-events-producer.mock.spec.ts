import { Injectable } from '@nestjs/common';
import { AbstractMessageMock, PactRabbitMqMessageProvider } from '@pe/pact-kit';
import { WidgetsBusinessDataInterface } from '../../../src/bus-messages/interfaces';
import * as uuid from 'uuid';
import { WidgetsEventsProducer } from '../../../src/bus-messages/producers';

@Injectable()
export class WidgetsEventMessagesMock extends AbstractMessageMock {
  private widgetsBusinessData: WidgetsBusinessDataInterface[] = [
    {
      business: uuid.v4(),
    } as WidgetsBusinessDataInterface,
  ];

  @PactRabbitMqMessageProvider('widgets.event.report-data.prepared')
  public async mockWidgetReportDataPreparedEvent(): Promise<void> {
    const producer: WidgetsEventsProducer = await this.getProvider<WidgetsEventsProducer>(WidgetsEventsProducer);
    await producer.produceWidgetsReportDataPreparedEvent(this.widgetsBusinessData);
  }
}
