import { Injectable } from '@nestjs/common';
import { AbstractMessageMock, PactRabbitMqMessageProvider } from '@pe/pact-kit';
import { AppointmentRabbitEventsEnum } from '../../../src/appointments/enums';
import { CreateContactsRequestProducer } from 'src/appointments/producers/create-contacts-request.producer';
import { CreateContactRBMQDto } from 'src/appointments/dto';
import { ContactStub } from '../stub/contact.stub';
import { AppointmentMocked } from '../stub/appointment.stub';

@Injectable()
export class ContactMessageMock extends AbstractMessageMock {
  @PactRabbitMqMessageProvider(AppointmentRabbitEventsEnum.createContactRequest)
  public async mockAppointmentUpdated(): Promise<void> {
    const producer: CreateContactsRequestProducer = await this.getProvider<CreateContactsRequestProducer>(
      CreateContactsRequestProducer,
    );
    const contact: CreateContactRBMQDto = {
        email: ContactStub.email,
        firstName: ContactStub.firstName,
        lastName: ContactStub.lastName,
        mobilePhone: ContactStub.mobilePhone,
    };
    await producer.request(
      contact,
      AppointmentMocked.businessId
    );
  }
}
