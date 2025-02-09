import { partialFactory, PartialFactory, SequenceGenerator } from '@pe/cucumber-sdk';
import * as uuid from 'uuid';

const seq: SequenceGenerator = new SequenceGenerator();

const defaultFactory: any = (): any => {
  seq.next();

  return ({
    _id: uuid.v4(),
    businessId: uuid.v4(),
    marketplaceProduct: uuid.v4(),
    productId: uuid.v4(),
  });
};

export class ProductSubscriptionFactory {
  public static create: PartialFactory<any> = partialFactory<any>(defaultFactory);
}
