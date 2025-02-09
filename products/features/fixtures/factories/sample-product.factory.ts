import { partialFactory, uniqueString, SequenceGenerator } from '@pe/cucumber-sdk';
import * as uuid from 'uuid';
import { PartialFactory } from '@pe/cucumber-sdk/module/fixtures/helpers/partial-factory';

const seq: SequenceGenerator = new SequenceGenerator(1);

const sampleProductDefaultFactory: any = () => {
  seq.next();

  return {
    _id: uuid.v4(),
    active: true,
    barcode: 'barcode',
    businessId: 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb',
    currency: 'EUR',
    description: `Product ${seq.current} description`,
    example: true,
    images: ['http://image1.url'],
    industry: 'BRANCHE_FASHION',
    onSales: false,
    price: seq.current,
    product: 'BUSINESS_PRODUCT_RETAIL_B2C',
    salePrice: null,
    shipping: {
      height: 4,
      length: 3,
      weight: 43,
      width: 4,
    },
    sku: uniqueString(),
    title: `Product ${seq.current}`,
    type: 'physical',
    vatRate: seq.current,
  };
};

export const sampleProductFactory: any = partialFactory(sampleProductDefaultFactory);
