import { partialFactory, SequenceGenerator } from '@pe/cucumber-sdk';
import { DocumentDefinition } from 'mongoose';
import { PartialFactory } from '@pe/cucumber-sdk/module/fixtures/helpers/partial-factory';
import * as uuid from 'uuid';

import { FieldTypesEnum } from '../../src/appointments/enums';
import { FieldDocument } from '../../src/appointments/schemas';

const seq: SequenceGenerator = new SequenceGenerator(0);

const defaultFactory: () => DocumentDefinition<FieldDocument> = () => {
  seq.next();

  return {
    businessId: uuid.v4(),
    editableByAdmin: true,
    filterable: true,
    _id: uuid.v4(),
    name: `field ${seq.current}`,
    type: FieldTypesEnum.Text,
  };
};

export const fieldFactory: PartialFactory<DocumentDefinition<FieldDocument>> = partialFactory(defaultFactory);
