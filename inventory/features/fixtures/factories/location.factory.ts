import { partialFactory, PartialFactory, SequenceGenerator } from '@pe/cucumber-sdk';
import * as uuid from 'uuid';

const seq: SequenceGenerator = new SequenceGenerator();

const defaultFactory: any = (): any => {
  seq.next();

  return ({
    _id: uuid.v4(),
    businessId: uuid.v4(),
    city: 'city',
    countryCode: '+91',
    name: 'name',
    stateProvinceCode: 'stateProvinceCode',
    streetName: 'streetName',
    streetNumber: 'streetNumber',
    zipCode: 'zipCode',
  });
};

export class LocationFactory {
  public static create: PartialFactory<any> = partialFactory<any>(defaultFactory);
}
