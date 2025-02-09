import { partialFactory, PartialFactory, SequenceGenerator } from '@pe/cucumber-sdk';
import * as uuid from 'uuid';

const seq: SequenceGenerator = new SequenceGenerator();

const defaultFactory: any = (): any => {
  seq.next();
  
  return ({
    _id: uuid.v4(),
    locationId: uuid.v4(),
    stock: 0,
  });
};

export class InventoryLocationFactory {
  public static create: PartialFactory<any> = partialFactory<any>(defaultFactory);
}
