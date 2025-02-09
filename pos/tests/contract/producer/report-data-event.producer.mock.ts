import { Injectable } from '@nestjs/common';
import { AbstractMessageMock, PactRabbitMqMessageProvider } from '@pe/pact-kit';
import { MailReportInterface } from '../../../src/terminal/interfaces';
import * as uuid from 'uuid';
import { ReportDataEventProducer } from '../../../src/terminal/producers';

@Injectable()
export class ReportDataMessagesMock extends AbstractMessageMock {
  private mailReport: MailReportInterface[] = [
    {
      business: uuid.v4(),
    } as MailReportInterface,
  ];

  @PactRabbitMqMessageProvider('pos.active.event.report-data.prepared')
  public async mockProduceReportDataPreparedEvent(): Promise<void> {
    const producer: ReportDataEventProducer = await this.getProvider<ReportDataEventProducer>(ReportDataEventProducer);
    await producer.produceReportDataPrepared(this.mailReport);
  }
}
