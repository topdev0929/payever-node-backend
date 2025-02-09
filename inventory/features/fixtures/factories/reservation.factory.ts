import { partialFactory, PartialFactory, SequenceGenerator } from '@pe/cucumber-sdk';
import * as uuid from 'uuid';

const seq: SequenceGenerator = new SequenceGenerator();

const defaultFactory = (): any => {
  seq.next();

  return ({
    _id: uuid.v4(),
    businessId: uuid.v4(),
    inventory: uuid.v4(),
    quantity: seq.current * 10,
  });
};

export class ReservationFactory {
  public static create: PartialFactory<any> = partialFactory<any>(defaultFactory);
}
