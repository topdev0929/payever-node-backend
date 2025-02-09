import * as uuid from 'uuid';
import { DocumentDefinition } from 'mongoose';

import { partialFactory, SequenceGenerator } from '@pe/cucumber-sdk';
import { PartialFactory } from '@pe/cucumber-sdk/module/fixtures/helpers/partial-factory';
import { AppointmentDocument } from '../../src/appointments/schemas';

const seq: SequenceGenerator = new SequenceGenerator(0);

const defaultFactory: () => DocumentDefinition<AppointmentDocument> = () => {
  seq.next();

  return {
    businessId: uuid.v4(),
    customerName: `First Last`,
    email: `user${seq.current}@payever.de`,
    _id: uuid.v4(),
  };
};

export const appointmentsFactory: PartialFactory<DocumentDefinition<AppointmentDocument>> = partialFactory(defaultFactory);
