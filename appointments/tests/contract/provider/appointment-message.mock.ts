import { Injectable } from '@nestjs/common';
import { AbstractMessageMock, PactRabbitMqMessageProvider } from '@pe/pact-kit';
import { AppointmentEventsProducer } from '../../../src/appointments/producers';
import { AppointmentRabbitEventsEnum } from '../../../src/appointments/enums';
import { appointmentToRmqTransformer } from '../../../src/appointments/transformers';
import { AppointmentDocument, AppointmentFieldDocument, FieldDocument } from '../../../src/appointments/schemas';
import { AppointmentMocked } from '../stub/appointment.stub';
import { ContactStub } from '../stub/contact.stub';

@Injectable()
export class AppointmentMessageMock extends AbstractMessageMock {

  @PactRabbitMqMessageProvider(AppointmentRabbitEventsEnum.created)
  public async mockAppointmentCreated(): Promise<void> {
    const producer: AppointmentEventsProducer = await this.getProvider<AppointmentEventsProducer>(
      AppointmentEventsProducer,
    );
    await producer.produceAppointmentEvent(
      AppointmentRabbitEventsEnum.created,
      appointmentToRmqTransformer({
        _id: AppointmentMocked._id,
        id: AppointmentMocked._id,
        fields: AppointmentMocked.fields as AppointmentFieldDocument[],
        appointmentNetwork: AppointmentMocked.appointmentNetwork,
        duration: AppointmentMocked.duration,
        measuring: AppointmentMocked.measuring,
      } as AppointmentDocument),
    );
  }

  @PactRabbitMqMessageProvider(AppointmentRabbitEventsEnum.updated)
  public async mockAppointmentUpdated(): Promise<void> {
    const producer: AppointmentEventsProducer = await this.getProvider<AppointmentEventsProducer>(
      AppointmentEventsProducer,
    );
    await producer.produceAppointmentEvent(
      AppointmentRabbitEventsEnum.updated,
      appointmentToRmqTransformer({
        _id: AppointmentMocked._id,
        id: AppointmentMocked._id,
        fields: AppointmentMocked.fields as AppointmentFieldDocument[],
        appointmentNetwork: AppointmentMocked.appointmentNetwork,
        duration: AppointmentMocked.duration,
        measuring: AppointmentMocked.measuring,
      } as AppointmentDocument),
    );
  }

  @PactRabbitMqMessageProvider(AppointmentRabbitEventsEnum.removed)
  public async mockAppointmentRemoved(): Promise<void> {
    const producer: AppointmentEventsProducer = await this.getProvider<AppointmentEventsProducer>(
      AppointmentEventsProducer,
    );
    await producer.produceAppointmentEvent(
      AppointmentRabbitEventsEnum.removed,
      {
        _id: AppointmentMocked._id,
      },
    );
  }

  @PactRabbitMqMessageProvider(AppointmentRabbitEventsEnum.export)
  public async mockAppointmentExported(): Promise<void> {
    const producer: AppointmentEventsProducer = await this.getProvider<AppointmentEventsProducer>(
      AppointmentEventsProducer,
    );
    await producer.produceAppointmentEvent(
      AppointmentRabbitEventsEnum.export,
      AppointmentMocked,
    );
  }
  @PactRabbitMqMessageProvider(AppointmentRabbitEventsEnum.createContactRequest)
  public async mockAppointmentCreateContact(): Promise<void> {
    const producer: AppointmentEventsProducer = await this.getProvider<AppointmentEventsProducer>(
      AppointmentEventsProducer,
    );
    await producer.produceAppointmentEvent(
      AppointmentRabbitEventsEnum.createContactRequest,
      ContactStub
    );
  }
}
