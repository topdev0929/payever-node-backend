import { DefaultFactory, PartialFactory, partialFactory } from '@pe/cucumber-sdk';
import * as uuid from 'uuid';
import { OrderInterface } from '../../src/legacy-api/interfaces';

type OrderType = OrderInterface & { _id: string };

const LocalFactory: DefaultFactory<OrderType> = (): OrderType => {
  return {
    _id: uuid.v4(),
    purchase: {
      amount: 200,
      currency: 'EUR',
      delivery_fee: 0,
      down_payment: 0,
    },
    customer: {
      birthdate: new Date('1990-01-30T00:00:00.000Z'),
      phone: '+4912345678',
      email: 'test@test.com',
    },
    cart: [
      {
        brand: 'Apple',
        name: 'Test Item',
        identifier: '12345',
        sku: '12345',
        quantity: 1,
        unit_price: 200,
        tax_rate: 0,
        total_amount: 200,
        total_tax_amount: 0,
        description: 'test description',
        image_url: 'http://img.url',
        product_url: 'http://product.url',
        category: 'Electronics',
        attributes: {
          weight: 10,
          dimensions: {
            height: 5,
            width: 15,
            length: 10,
          }
        }
      }
    ],
    billing_address: {
      first_name: 'Grün',
      last_name: 'Ampel',
      street: 'Test 12',
      street_number: '12',
      salutation: 'mr',
      zip: '38889',
      country: 'DE',
      city: 'Elbingerode (Harz)',
      organization_name: 'Test',
      street_name: 'Test',
      house_extension: 'A',
    },
    shipping_address: {
      first_name: 'Grün',
      last_name: 'Ampel',
      street: 'Test 12',
      street_number: '12',
      salutation: 'mr',
      zip: '38889',
      country: 'DE',
      city: 'Elbingerode (Harz)',
      organization_name: 'Test',
      street_name: 'Test',
      house_extension: 'A',
    },
    reference: 'as54a5sd45as4d',
    business_id: '2382ffce-5620-4f13-885d-3c069f9dd9b4',
    created_at: new Date(),
    updated_at: new Date(),
  };
};

export class OrderFactory {
  public static create: PartialFactory<OrderType> = partialFactory<OrderType>(LocalFactory);
}
