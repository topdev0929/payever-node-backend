import { v4 as uuid } from 'uuid';
import { DocumentDefinition } from 'mongoose';
import { SequenceGenerator, partialFactory, PartialFactory } from '@pe/cucumber-sdk';
import { CategoryTypeEnum, IntegrationModel } from '@pe/synchronizer-kit';

import { randomFromList, incrementAndGetSeq } from './helpers';

export const integrationDefaultFactory = (seq: SequenceGenerator) => () => ({
  _id: uuid(),
  name: `Integration ${incrementAndGetSeq(seq)}`,
  category: CategoryTypeEnum.Contacts,
} as DocumentDefinition<IntegrationModel>);

export const integrationFactory: PartialFactory<DocumentDefinition<IntegrationModel>> = partialFactory(
  integrationDefaultFactory(new SequenceGenerator()),
);
