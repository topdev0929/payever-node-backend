import * as uuid from 'uuid';
import { fixture } from '@pe/cucumber-sdk';
import { FilterFieldTypeEnum, StringFieldConditionEnum } from '@pe/nest-kit';
import { PriceConditionFieldEnum } from '../../../../src/products';

import { ProductModel } from '../../../../src/products/models';
import { productFactory } from '../../factories/product.factory';

const someBusinessId: string = '21f4947e-929a-11e9-bb05-7200004fe4c0';
const someOtherBusinessId: string = '5f02c4a8-929a-11e9-812b-7200004fe4c0';

export = fixture<ProductModel>('NewProductModel', productFactory, [
  {
    businessId: someBusinessId,
    uuid: '3799bb06-929a-11e9-b5a6-7200004fe4c0',
    slug: 'a-a',
    title: 'Product A',

    priceTable: [{
      condition: {
        field: PriceConditionFieldEnum.CustomerUserId,
        fieldCondition: StringFieldConditionEnum.Is,
        fieldType: FilterFieldTypeEnum.String,
        value: uuid.v4(),
      },
      currency: 'USD',
      price: 50,
      sale: {
        saleEndDate: new Date('2019-04-01'),
        salePercent: 10,
        salePrice: 45,
        saleStartDate: new Date('2019-04-03'),
      },
      vatRate: 12,
    }],
  },
  {
    businessId: someOtherBusinessId,
    title: 'Product B',
    slug: 'b-b',
    uuid: '4e58fe33-97d3-41d0-a789-cf43a11e469f',
  },
  {
    businessId: someBusinessId,
    title: 'Item C',
    slug: 'c-c',
    uuid: 'e563339f-0b4c-4aef-92e7-203b9761981c',
  },
  {
    businessId: someBusinessId,
    title: 'Item D',
    slug: 'd-d',
    uuid: 'a482bf57-1aec-4304-8751-4ce5cea603a4',
  },
]);
