import * as uuid from 'uuid';

import { partialFactory, SequenceGenerator } from '@pe/cucumber-sdk';

const seq: SequenceGenerator = new SequenceGenerator(1);

const defaultFactory: any = () => {
  seq.next();

  return {
    _id: uuid.v4(),
    barcode: `barcode_${seq.current}`,
    businessId: uuid.v4(),
    description: `Variant ${seq.current} description`,
    images: [],
    imagesUrl: [],
    options: [],
    price: seq.current * 100,
    product: uuid.v4,
    sku: `sku_${seq.current}`,
    title: `Variant ${seq.current}`,
  };
};

export const variantFactory: any = partialFactory(defaultFactory);
