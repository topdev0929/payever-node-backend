import { Injectable } from '@nestjs/common';
import { RabbitMqClient } from '@pe/nest-kit';
import { RabbitBinding } from '../../environments';
import { PreparedCheckoutInterface } from '../interfaces';

@Injectable()
export class BusMessageProducer {
  constructor(
    private readonly rabbitClient: RabbitMqClient,
  ) { }

  public async produceCheckoutReportDataPreparedEvent(preparedCheckout: PreparedCheckoutInterface[]): Promise<void> {
    await this.rabbitClient.send(
      {
        channel: RabbitBinding.CheckoutPrepared,
        exchange: 'async_events',
      },
      {
        name: RabbitBinding.CheckoutPrepared,
        payload: preparedCheckout,
      },
    );
  }
}
