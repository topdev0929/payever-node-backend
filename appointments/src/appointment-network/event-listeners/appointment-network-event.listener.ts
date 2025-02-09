import { Injectable } from '@nestjs/common';

import { EventListener } from '@pe/nest-kit';
import { 
  AppointmentNetworkEventsEnum, 
  AppointmentNetworkRabbitMessagesEnum, 
} from '../enums';
import { AppointmentNetworkModel } from '../models';
import { AppointmentNetworkMessagesProducer } from '../producers';
import { AccessConfigService } from '../services';

@Injectable()
export class AppointmentNetworkEventsListener {
  constructor(
    private readonly appointmentNetworkMessagesProducer: AppointmentNetworkMessagesProducer,
    private readonly accessConfigService: AccessConfigService,
  ) { }

  @EventListener(AppointmentNetworkEventsEnum.AppointmentNetworkCreated)
  public async onBillingAppointmentNetworkCreated(appointmentNetwork: AppointmentNetworkModel): Promise<void> {
    await this.accessConfigService.createOrUpdate(
      appointmentNetwork,
      {
        isLive: false,
      },
    );

    await this.appointmentNetworkMessagesProducer.produceAppointmentNetworkEvent(
      AppointmentNetworkRabbitMessagesEnum.AppointmentNetworkCreated,
      appointmentNetwork,
    );
  }

  @EventListener(AppointmentNetworkEventsEnum.AppointmentNetworkRemoved)
  public async onBillingAppointmentNetworkDeleted(appointmentNetwork: AppointmentNetworkModel): Promise<void> {
    await this.appointmentNetworkMessagesProducer.produceAppointmentNetworkEvent(
      AppointmentNetworkRabbitMessagesEnum.AppointmentNetworkRemoved,
      appointmentNetwork,
    );
  }

  @EventListener(AppointmentNetworkEventsEnum.AppointmentNetworkUpdated)
  public async onBillingAppointmentNetworkUpdated(appointmentNetwork: AppointmentNetworkModel): Promise<void> {
    await this.appointmentNetworkMessagesProducer.produceAppointmentNetworkEvent(
      AppointmentNetworkRabbitMessagesEnum.AppointmentNetworkUpdated,
      appointmentNetwork,
    );
  }
}
