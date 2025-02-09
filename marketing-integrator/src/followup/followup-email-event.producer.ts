import { Injectable, Logger } from '@nestjs/common';
import { RabbitMqClient } from '@pe/nest-kit';
import { SignupModel } from '../signups';

@Injectable()
export class FollowupEmailEventProducer {
  constructor(private readonly rabbitMqClient: RabbitMqClient) { }

  public async sendSignupEmail(templateName: string, signup: SignupModel): Promise<void> {
    return this.rabbitMqClient.send(
      {
        channel: 'payever.event.mailer.send',
        exchange: 'async_events',
      },
      {
        name: 'payever.event.mailer.send',
        payload: {
          params: {
            signup,
          },
          to: signup.email,
          type: templateName,
        },
      },
    );
  }
}
