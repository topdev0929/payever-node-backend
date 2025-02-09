import * as uuid from 'uuid';
import { partialFactory, SequenceGenerator } from '@pe/cucumber-sdk';

const seq: SequenceGenerator = new SequenceGenerator();

export const defaultCategoryFactory: any = (): any => {
  seq.next();

  return ({
    ancestors: [],
    attributes: [],
    businessId: uuid.v4(),
    description: `Description ${seq.current}`,
    name: `Category ${seq.current}`,
    parent: null,
    slug: `category_${seq.current}`,
  });
};

export const categoryFactory: any = partialFactory(defaultCategoryFactory);
