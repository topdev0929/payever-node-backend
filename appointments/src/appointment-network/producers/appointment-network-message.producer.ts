import { Injectable } from '@nestjs/common';
import { RabbitMqClient } from '@pe/nest-kit';

import { AppointmentNetworkModel } from '../models';
import { AppointmentNetworkRabbitMessagesEnum } from '../enums';

@Injectable()
export class AppointmentNetworkMessagesProducer {
  constructor (
    private readonly rabbitClient: RabbitMqClient,
  ) { }

  public async produceAppointmentNetworkEvent(
    eventName: AppointmentNetworkRabbitMessagesEnum, 
    appointmentNetwork: AppointmentNetworkModel,
  ): Promise<void> {
    await this.rabbitClient.send(
      {
        channel: eventName,
        exchange: 'async_events',
      },
      {
        name: eventName,
        payload: {
          ...appointmentNetwork,
          business: {
            id: appointmentNetwork.business,
          },
          id: appointmentNetwork._id || appointmentNetwork.id,
        },
      },
    );
  }
}
