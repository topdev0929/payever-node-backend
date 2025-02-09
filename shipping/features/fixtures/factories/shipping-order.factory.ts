import * as uuid from 'uuid';
import { partialFactory, SequenceGenerator } from '@pe/cucumber-sdk';
import { DimensionUnitEnums, WeightUnitEnums } from '../../../src/shipping/enums';
import { ShippingOrderModel } from '../../../src/shipping/models';
import { addressFactory } from './address.factory';

const seq: SequenceGenerator = new SequenceGenerator();

export const defaultShippingOrderFactory: any = (): ShippingOrderModel => {
  seq.next();

  const address = addressFactory({});
  return ({
    businessId: uuid.v4(),
    businessName: `Business_${seq.current}`,
    transactionId: uuid.v4(),
    legalText: `Legal text ${seq.current} `,
    shippingOrigin: uuid.v4(),
    shipmentNumber: false,
    trackingUrl: null,
    trackingId: null,
    label: null,
    shippingItems: [],
    shippingBoxes: [{
      dimensionUnit: DimensionUnitEnums.cm,
      height: 10,
      isDefault: false,
      length: 10,
      name: `Box_${seq.current}`,
      weight: 10,
      weightUnit: WeightUnitEnums.kg,
      width: 10,
    }],
    billingAddress: address,
    shippingAddress: address,
  });
};

export const shippingOrderFactory: any = partialFactory(defaultShippingOrderFactory);
