import { Controller } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { RabbitChannelsEnum } from '../../../../environments';
import { SpotlightService } from '../../../services';
import { SpotlightInterface } from '../../../interfaces';
import { AppointmentRabbitEventsEnum } from '../enums';
import { AppointmentEventDto } from '../dto';
import { AppEnum } from '../../../enums';

@Controller()
export class AppointmentMessagesConsumer {
  constructor(
    private readonly spotlightService: SpotlightService,
  ) { }

  @MessagePattern({
    channel: RabbitChannelsEnum.Spotlight,
    name: AppointmentRabbitEventsEnum.AppointmentCreated,
  })
  public async onAppointmentCreated(data: AppointmentEventDto): Promise<void> {
    await this.createOrUpdateAppointmentFromEvent(data);
  }

  @MessagePattern({
    channel: RabbitChannelsEnum.Spotlight,
    name: AppointmentRabbitEventsEnum.AppointmentUpdated,
  })
  public async onAppointmentUpdated(data: AppointmentEventDto): Promise<void> {
    await this.createOrUpdateAppointmentFromEvent(data);
  }

  @MessagePattern({
    channel: RabbitChannelsEnum.Spotlight,
    name: AppointmentRabbitEventsEnum.AppointmentRemoved,
  })
  public async onAppointmentRemoved(data: AppointmentEventDto): Promise<void> {
    await this.spotlightService.delete(
      data._id,
    );
  }

  @MessagePattern({
    channel: RabbitChannelsEnum.Spotlight,
    name: AppointmentRabbitEventsEnum.AppointmentExport,
  })
  public async onAppointmentExported(data: AppointmentEventDto): Promise<void> {
    await this.createOrUpdateAppointmentFromEvent(data);
  }

  private async createOrUpdateAppointmentFromEvent(data: AppointmentEventDto): Promise<void> {
    await this.spotlightService.createOrUpdate(
      this.appointmentToSpotlightDocument(data), 
      data._id,
    );
  }

  private appointmentToSpotlightDocument(data: AppointmentEventDto): SpotlightInterface {

    return {
      app: AppEnum.Appointment,
      businessId: data.businessId,
      description: data.note,
      icon: '',
      serviceEntityId: data._id,
      title: data.date,
    };
  }
}
