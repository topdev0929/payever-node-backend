import * as uuid from 'uuid';
import { partialFactory } from '@pe/cucumber-sdk';

const productCountrySettingDefaultFactory: any = () => {
  return {
    _id: uuid.v4(),
    countrySettings: {
      EN: {
        active: true,
        currency: 'EUR',
        onSales: false,
        price: 78000,
        recommendations: {
          recommendations: [
            {
              id: '0722c350-7597-4d7a-a51c-98e9dc65822f',
              images: [
                '1aea5a01-53f8-4c84-b1fb-290988917281-Screenshot2021-09-01at13.15.17.png',
              ],
              name: '-+-+-+()()(())',
            },
            {
              id: 'e806f51a-393e-4e9d-80dc-a88d700e6163',
              images: [
                'e8f0d4fd-835e-4a15-afa9-331e854e36f1-Screenshot2021-08-09at19.11.51.png',
              ],
              name: '123123123',
            },
            {
              id: 'cec80d89-1446-4548-803b-9805bb49bcc0',
              images: [],
              name: '123111111111',
            },
          ],
          sku: 'null-2',
        },
        salePrice: 58000,
        shipping: {
          height: 0,
          length: 0,
          measure_mass: 'kg',
          measure_size: 'cm',
          weight: 0,
          width: 0,
        },
        vatRate: 10,
      },
      US: {
        active: false,
        currency: 'USD',
        onSales: true,
        price: 78000,
        recommendations: {
          recommendations: [
            {
              id: '0722c350-7597-4d7a-a51c-98e9dc65822f',
              images: [
                '1aea5a01-53f8-4c84-b1fb-290988917281-Screenshot2021-09-01at13.15.17.png',
              ],
              name: '-+-+-+()()(())',
            },
            {
              id: 'e806f51a-393e-4e9d-80dc-a88d700e6163',
              images: [
                'e8f0d4fd-835e-4a15-afa9-331e854e36f1-Screenshot2021-08-09at19.11.51.png',
              ],
              name: '123123123',
            },
            {
              id: 'cec80d89-1446-4548-803b-9805bb49bcc0',
              images: [],
              name: '123111111111',
            },
          ],
          sku: 'null-1',
        },
        salePrice: 58000,
        shipping: {
          height: 0,
          length: 0,
          measure_mass: 'kg',
          measure_size: 'cm',
          weight: 0,
          width: 0,
        },
        vatRate: 10,
      },
    },
    product: uuid.v4(),
  };
};

export const productCountrySettingFactory: any = partialFactory(productCountrySettingDefaultFactory);
