import { Injectable } from '@nestjs/common';
import { RabbitMqClient } from '@pe/nest-kit';
import { EventsEnum } from '../enum';
import { BusinessModel, PaymentCode } from '../interfaces';

@Injectable()
export class RabbitProducer {
  constructor(
    private readonly rabbitClient: RabbitMqClient,
  ) { }

  public async codeUpdated(code: PaymentCode): Promise<void> {
    return this.send(EventsEnum.codeUpdated, code);
  }

  public async transactionPaymentUpdate(code: PaymentCode): Promise<void> {
    if (code.flow && code.flow.payment) {
      return this.send(EventsEnum.transactionsPaymentUpdated, {
        payment: {
          amount: code.flow.amount,
          id: code.flow.payment.id,
          payment_details: [],
        },
      });
    }
  }

  public async settingsUpdated(business: BusinessModel): Promise<void> {
    return this.send(EventsEnum.settingsUpdated, business);
  }

  private send(channel: string, payload: any): Promise<void> {
    return this.rabbitClient.send(
      { channel, exchange: 'async_events' },
      { name: channel, payload },
    );
  }
}
