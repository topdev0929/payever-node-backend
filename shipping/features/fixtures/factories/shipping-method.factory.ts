import * as uuid from 'uuid';
import { partialFactory, SequenceGenerator } from '@pe/cucumber-sdk';
import { ShippingMethodModel } from '../../../src/shipping/models';

const seq: SequenceGenerator = new SequenceGenerator();

export const defaultShippingMethodFactory: any = (): ShippingMethodModel => {
  seq.next();

  return ({
    businessId: uuid.v4(),
    integration: uuid.v4(),
    integrationRule: uuid.v4(),
  });
};

export const shippingMethodFactory: any = partialFactory(defaultShippingMethodFactory);
