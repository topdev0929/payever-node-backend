import * as uuid from 'uuid';

import { partialFactory, SequenceGenerator } from '@pe/cucumber-sdk';

const seq: SequenceGenerator = new SequenceGenerator(1);

const defaultFactory: any = () => {
  seq.next();

  return {
    companyAddress: {
      _id: uuid.v4(),
      city: `CITY_${seq.current}`,
      country: `COUNTRY_${seq.current}`,
      street: `STREET_${seq.current}`,
      zipCode: `ZIP_CODE_${seq.current}`,
    },
    companyDetails: {
      industry: 'Some Industry',
      product: 'Some Product',
    },
    uuid: uuid.v4(),
  };
};

export const businessFactory: any = partialFactory(defaultFactory);
