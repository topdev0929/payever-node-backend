import { Injectable } from '@nestjs/common';
import { RabbitMqClient } from '@pe/nest-kit';

import { AppointmentDocument } from '../schemas';
import { AppointmentRabbitEventsEnum } from '../enums';

@Injectable()
export class AppointmentEventsProducer {
  constructor(
    private readonly rabbitMqClient: RabbitMqClient,
  ) { }

  public async produceAppointmentEvent(
    eventName: AppointmentRabbitEventsEnum,
    payload: any,
  ): Promise<void> {
    return this.rabbitMqClient.send({
      channel: eventName,
      exchange: 'async_events',
    }, {
      name: eventName,
      payload,
    });
  }
}
