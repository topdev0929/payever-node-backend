import { Injectable } from '@nestjs/common';
import * as uuid from 'uuid';

import { AbstractMessageMock, PactRabbitMqMessageProvider } from '@pe/pact-kit';
import { PreparedCheckoutInterface } from '../../../src/mail-report/interfaces';
import { RabbitBinding } from '../../../src/environments';
import { BusMessageProducer } from '../../../src/mail-report/producer';

@Injectable()
export class BusMessagesMock extends AbstractMessageMock {
  private preparedCheckouts: PreparedCheckoutInterface[] = [
    {
      business: uuid.v4(),
    } as PreparedCheckoutInterface,
  ];

  @PactRabbitMqMessageProvider(RabbitBinding.CheckoutPrepared)
  public async mockCheckoutReportPreparedEvent(): Promise<void> {
    const producer: BusMessageProducer = await this.getProvider<BusMessageProducer>(BusMessageProducer);
    await producer.produceCheckoutReportDataPreparedEvent(this.preparedCheckouts);
  }
}
