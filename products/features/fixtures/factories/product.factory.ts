import { DocumentDefinition } from 'mongoose';
import * as uuid from 'uuid';

import { DefaultFactory, PartialFactory, partialFactory, SequenceGenerator, uniqueString } from '@pe/cucumber-sdk';
import { ProductDocument } from '../../../src/new-products/documents/product.document';

const seq: SequenceGenerator = new SequenceGenerator(1);

const productDefaultFactory: DefaultFactory<DocumentDefinition<ProductDocument>> = () => {
  seq.next();

  return {
    active: true,
    apps: ['builder'],
    barcode: 'barcode',
    businessId: uuid.v4(),
    categories: [
      {
        _id: uuid.v4(),
        businessId: uuid.v4(),
        slug: 'some',
        title: 'Some category',
      },
    ],
    collections: [],
    createdAt: seq.currentDate,
    currency: 'USD',
    description: `Product ${seq.current} description`,
    example: false,
    images: [],
    imagesUrl: [],
    price: 1000,
    sale: {
      onSales: false,
      salePrice: 2000,
    },
    sku: uniqueString(),
    title: `Product ${seq.current}`,
    type: 'digital',
    updatedAt: seq.currentDate,
    uuid: uuid.v4(),
  };
};

export const productFactory: PartialFactory<DocumentDefinition<ProductDocument>> =
  partialFactory<DocumentDefinition<ProductDocument>>(productDefaultFactory);
