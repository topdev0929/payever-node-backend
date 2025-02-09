import { Injectable } from '@nestjs/common';
import { PaymentMailModel } from '../models';
import { RabbitMqClient } from '@pe/nest-kit';
import { RabbitEventNameEnum } from '../enum';
import { BusinessMailDto } from '../dto';

@Injectable()
export class MailerEventsProducer {
  constructor(private readonly rabbitMqClient: RabbitMqClient) { }

  public async producePaymentMailSentEvent(sentPaymentMail: PaymentMailModel): Promise<void> {
    return this.rabbitMqClient.send(
      {
        channel: RabbitEventNameEnum.PaymentMailSent,
        exchange: 'async_events',
      },
      {
        name: RabbitEventNameEnum.PaymentMailSent,
        payload: {
          businessId: sentPaymentMail?.eventData?.business?.uuid,
          id: sentPaymentMail.id,
          serviceEntityId: sentPaymentMail?.eventData?.serviceEntityId,
          templateName: sentPaymentMail.templateName,
          transactionId: sentPaymentMail.transactionId,
        },
      },
    );
  }

  public async produceBusinessMailSentEvent(sentBusinessMail: BusinessMailDto): Promise<void> {
    return this.rabbitMqClient.send(
      {
        channel: RabbitEventNameEnum.BusinessMailSent,
        exchange: 'async_events',
      },
      {
        name: RabbitEventNameEnum.BusinessMailSent,
        payload: sentBusinessMail,
      },
    );
  }
}
