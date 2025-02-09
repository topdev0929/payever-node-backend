import { partialFactory, PartialFactory, SequenceGenerator } from '@pe/cucumber-sdk';
import * as uuid from 'uuid';

const seq: SequenceGenerator = new SequenceGenerator();

const defaultFactory = (): any => {
  seq.next();

  return ({
    _id: uuid.v4(),
    barcode: `barcode_${seq.current}`,
    businessId: uuid.v4(),
    isNegativeStockAllowed: true,
    isTrackable: true,
    product: uuid.v4(),
    reserved: seq.current * 10,
    sku: `sku_${seq.current}`,
    stock: seq.current * 20,
  });
};

export class InventoryFactory {
  public static create: PartialFactory<any> = partialFactory<any>(defaultFactory);
}
