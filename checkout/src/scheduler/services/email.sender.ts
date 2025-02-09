import { RabbitMqClient } from '@pe/nest-kit';
import { RabbitBinding } from '../../environments';
import { Injectable } from '@nestjs/common';

@Injectable()
export class EmailSender {
  constructor(
    private readonly rabbitClient: RabbitMqClient,
  ) { }

  public async sendPaymentLinkReminderEmail(customerEmail: string, redirectUrl: string): Promise<void> {
    if (!customerEmail) {
      return;
    }

    const emailData: any = {
      templateName: 'payment.link.reminder',
      to: customerEmail,
      variables: {
        link: redirectUrl,
      },
    };

    await this.rabbitClient.send(
      {
        channel: RabbitBinding.PayeverEventUserEmail,
        exchange: 'async_events',
      },
      {
        name: RabbitBinding.PayeverEventUserEmail,
        payload: emailData,
      },
    );
  }
}

