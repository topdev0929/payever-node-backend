import { partialFactory, PartialFactory, SequenceGenerator } from '@pe/cucumber-sdk';
import * as uuid from 'uuid';
import { OrderStatusEnum } from '../../../src/inventory/enums';

const seq: SequenceGenerator = new SequenceGenerator();

const defaultFactory = (): any => {
  seq.next();

  return ({
    _id: uuid.v4(),
    flow: uuid.v4(),
    transaction: uuid.v4(),

    businessId: uuid.v4(),
    reservations: [],
    status: OrderStatusEnum.TEMPORARY,
  });
};

export class OrderFactory {
  public static create: PartialFactory<any> = partialFactory<any>(defaultFactory);
}
