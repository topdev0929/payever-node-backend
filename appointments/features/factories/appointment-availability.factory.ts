import * as uuid from 'uuid';
import { DocumentDefinition } from 'mongoose';

import { partialFactory, SequenceGenerator } from '@pe/cucumber-sdk';
import { PartialFactory } from '@pe/cucumber-sdk/module/fixtures/helpers/partial-factory';
import { AppointmentAvailabilityDocument } from '../../src/appointment-availability';

const seq: SequenceGenerator = new SequenceGenerator(0);

const defaultFactory: () => DocumentDefinition<AppointmentAvailabilityDocument> = () => {
  seq.next();

  return {
    businessId: uuid.v4(),
    isDefault: false,
    name: "test",
    timeZone: 'Etc/GMT',
    _id: uuid.v4(),
  };
};

export const appointmentAvailabilityFactory: PartialFactory<DocumentDefinition<AppointmentAvailabilityDocument>> = 
partialFactory(defaultFactory);
