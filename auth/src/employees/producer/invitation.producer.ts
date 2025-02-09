import { Injectable } from '@nestjs/common';
import { RabbitMqClient } from '@pe/nest-kit';
import { RabbitMessagesEnum } from '../../common';

@Injectable()
export class InivtationEventsProducer {
  constructor(private readonly rabbitClient: RabbitMqClient) { }

  public async produceStaffInvitationEmailMessage(
    businessId: string,
    to: string,
    link: string,
    locale: string = 'business',
  ): Promise<void> {
    await this.rabbitClient.send(
      {
        channel: RabbitMessagesEnum.PayeverBusinessEmail,
        exchange: 'async_events',
      },
      {
        name: RabbitMessagesEnum.PayeverBusinessEmail,
        payload: {
          businessId: businessId,
          locale: locale,
          subject: '',
          templateName: 'staff_invitation_new',
          to: to,
          variables: { staff_invitation: { link } },
        },
      },
      true,
    );
  }
}
