import { Matchers, MessageConsumerPact } from '@pact-foundation/pact';
import { asyncConsumerChecker, ExpectedMessageDto, PePact } from '@pe/pact-kit';
import 'mocha';
import { AppointmentEventDto } from '../../../src/spotlight/apps/appointment-app/dto';
import { AppointmentRabbitEventsEnum } from '../../../src/spotlight/apps/appointment-app/enums';
import { ProvidersEnum } from '../config';

const appointmentEventMatcher = {
  _id: Matchers.uuid(),
  businessId: Matchers.uuid(),
  allDay: Matchers.boolean(),
  repeat: Matchers.boolean(),
  date: Matchers.iso8601Date()
};

const messages: ExpectedMessageDto[] = [
  {
    contentMatcher: appointmentEventMatcher,
    dtoClass: AppointmentEventDto,
    name: AppointmentRabbitEventsEnum.AppointmentCreated,
  },
  {
    contentMatcher: appointmentEventMatcher,
    dtoClass: AppointmentEventDto,
    name: AppointmentRabbitEventsEnum.AppointmentUpdated,
  },
  {
    contentMatcher: appointmentEventMatcher,
    dtoClass: AppointmentEventDto,
    name: AppointmentRabbitEventsEnum.AppointmentExport,
  },
  {
    contentMatcher: appointmentEventMatcher,
    dtoClass: AppointmentEventDto,
    name: AppointmentRabbitEventsEnum.AppointmentRemoved,
  }
];

const messagePact: MessageConsumerPact = PePact.getMessageConsumer(ProvidersEnum.Appointment);

describe('Receive appointment bus messages', () => {
  for (const message of messages) {
    it(`Accepts valid "${message.name}" messages`, () => {
      return asyncConsumerChecker(messagePact, message);
    });
  }
});
