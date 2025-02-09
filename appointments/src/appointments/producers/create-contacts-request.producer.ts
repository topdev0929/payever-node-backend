import { Injectable } from '@nestjs/common';
import { RabbitMqClient } from '@pe/nest-kit';
import { CreateContactRBMQDto } from '../dto/create-appointment';
import { AppointmentRabbitEventsEnum } from '../enums';

@Injectable()
export class CreateContactsRequestProducer {
  constructor(
    private readonly rabbitClient: RabbitMqClient,
  ) { }

  public async request(
    contact: CreateContactRBMQDto,
    businessId: string,
  ): Promise<void> {
    await this.rabbitClient.send({
      channel: AppointmentRabbitEventsEnum.createContactRequest,
      exchange: 'async_events',
    }, {
      name: AppointmentRabbitEventsEnum.createContactRequest,
      payload: {
        businessId: businessId,
        fields: contact,
        type: 'person',
      },
    });
  }

}
