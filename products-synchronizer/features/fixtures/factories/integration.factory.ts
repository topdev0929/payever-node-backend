import { v4 as uuid } from 'uuid';
import { SequenceGenerator, partialFactory } from '@pe/cucumber-sdk';
import { randomFromList, incrementAndGetSeq } from './helpers';
import { CategoryTypeEnum } from '@pe/synchronizer-kit';

randomFromList([
  CategoryTypeEnum.Products,
  CategoryTypeEnum.Shopsystems,
]);

export const integrationDefaultFactory = (seq: SequenceGenerator) => () => ({
  _id: uuid(),
  name: `Integration ${incrementAndGetSeq(seq)}`,
  category: CategoryTypeEnum.Products,
});

export const integrationFactory = partialFactory(
  integrationDefaultFactory(new SequenceGenerator()),
);
