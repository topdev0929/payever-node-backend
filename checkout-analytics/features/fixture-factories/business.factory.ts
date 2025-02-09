import { DefaultFactory, PartialFactory, partialFactory } from '@pe/cucumber-sdk';
import * as uuid from 'uuid';

type BusinessType = { _id: string };

const LocalFactory: DefaultFactory<BusinessType> = (): BusinessType => {
  return {
    _id: uuid.v4(),
  } as BusinessType;
};

export class BusinessFactory {
  public static create: PartialFactory<any> = partialFactory<BusinessType>(LocalFactory);
}
