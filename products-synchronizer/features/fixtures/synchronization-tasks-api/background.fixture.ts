import { fixture, combineFixtures } from '@pe/cucumber-sdk';
import { BusinessModel } from '@pe/business-kit';
import { businessFactory } from '../factories';

export = combineFixtures(
  fixture<BusinessModel>('BusinessModel', businessFactory, [
    { _id: '9a9da687-ec9b-4b4d-bf8d-396cfa83f5a1' },
  ]),
);
