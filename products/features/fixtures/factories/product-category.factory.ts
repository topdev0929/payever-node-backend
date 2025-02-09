import * as uuid from 'uuid';
import { partialFactory, SequenceGenerator } from '@pe/cucumber-sdk';
import { CategoryInterface } from '../../../src/categories/interfaces';

const seq: SequenceGenerator = new SequenceGenerator();

export const defaultProductCategoryFactory: any = (): CategoryInterface => {
  seq.next();

  return ({
    businessId: uuid.v4(),
    name: `Category ${seq.current}`,
    slug: `category_${seq.current}`,
  });
};

export const productCategoryFactory: any = partialFactory(defaultProductCategoryFactory);
