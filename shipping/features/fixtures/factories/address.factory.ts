import { partialFactory, SequenceGenerator } from '@pe/cucumber-sdk';
import { AddressInterface } from '../../../src/shipping/interfaces';

const seq: SequenceGenerator = new SequenceGenerator();

export const defaultAddressFactory: any = (): AddressInterface => {
  seq.next();

  return ({
    city: `city_${seq.current}`,
    countryCode: `CO_${seq.current}`,
    name: `Name_${seq.current}`,
    phone: `Phone-${seq.current}`,
    stateProvinceCode: `Province_${seq.current}`,
    streetName: `Street name - ${seq.current}`,
    streetNumber: seq.current.toString(),
    zipCode: '11111',
  });
};

export const addressFactory: any = partialFactory(defaultAddressFactory);
