import * as uuid from 'uuid';
import { DocumentDefinition } from 'mongoose';

import { partialFactory, SequenceGenerator } from '@pe/cucumber-sdk';
import { PartialFactory } from '@pe/cucumber-sdk/module/fixtures/helpers/partial-factory';
import { AppointmentTypeDocument } from '../../src/appointment-types';

const seq: SequenceGenerator = new SequenceGenerator(0);

const defaultFactory: () => DocumentDefinition<AppointmentTypeDocument> = () => {
  seq.next();

  return {
    businessId: uuid.v4(),
    dateRange: 123,
    duration: 1,
    eventLink: '1234',
    indefinitelyRange: true,
    isDefault: false,
    isTimeAfter: false,
    isTimeBefore: false,
    name: 'test',
    schedule: 'working_hours',
    timeBefore: 23,
    timeAfter: 45,
    type: 'one_on_one',
    unit: 'hour',
    _id: uuid.v4(),
  };
};

export const appointmentTypeFactory: PartialFactory<DocumentDefinition<AppointmentTypeDocument>> = partialFactory(defaultFactory);
