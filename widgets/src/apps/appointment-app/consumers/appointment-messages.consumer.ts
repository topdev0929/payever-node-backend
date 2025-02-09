import { Controller } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { AppointmentService } from '../services';
import { AppointmentRabbitEventsEnum } from '../enums';
import { AppointmentEventDto } from '../dto';

@Controller()
export class AppointmentBlogMessagesConsumer {
  constructor(
    private readonly appointmentService: AppointmentService,
  ) { }

  @MessagePattern({
    name: AppointmentRabbitEventsEnum.created,
  })
  public async onAppointmentCreated(data: AppointmentEventDto): Promise<void> {
    await this.appointmentService.createOrUpdateAppointmentFromEvent(data);
  }

  @MessagePattern({
    name: AppointmentRabbitEventsEnum.updated,
  })
  public async onAppointmentUpdated(data: AppointmentEventDto): Promise<void> {
    await this.appointmentService.createOrUpdateAppointmentFromEvent(data);
  }

  @MessagePattern({
    name: AppointmentRabbitEventsEnum.removed,
  })
  public async onAppointmentRemoved(data: AppointmentEventDto): Promise<void> {
    await this.appointmentService.deleteAppointment(data);
  }

  @MessagePattern({
    name: AppointmentRabbitEventsEnum.export,
  })
  public async onAppointmentExported(data: AppointmentEventDto): Promise<void> {
    await this.appointmentService.createOrUpdateAppointmentFromEvent(data);
  }
}
