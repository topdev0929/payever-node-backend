import { partialFactory, PartialFactory, SequenceGenerator } from '@pe/cucumber-sdk';
import * as uuid from 'uuid';

const seq: SequenceGenerator = new SequenceGenerator();

const defaultFactory: any = (): any => {
  seq.next();

  return ({
    _id: uuid.v4(),
    businessId: uuid.v4(),
    channelSet: uuid.v4(),
    country: `COUNTRY_${seq.current}`,
    currency: `CURRENCY_${seq.current}`,
    price: seq.current * 100,
    title: `Product_${seq.current}`,
    type: 'physical',
  });
};

export class ProductFactory {
  public static create: PartialFactory<any> = partialFactory<any>(defaultFactory);
}
