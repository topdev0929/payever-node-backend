import * as uuid from 'uuid';
import { partialFactory, SequenceGenerator } from '@pe/cucumber-sdk';
import { PartialFactory } from '@pe/cucumber-sdk/module/fixtures/helpers/partial-factory';
import {
  IntegrationInterface,
} from '../../src/integration/interfaces';

const defaultFactory: () => any = () => {
  const seq: SequenceGenerator = new SequenceGenerator(0);
  seq.next();

  return {
    _id: uuid.v4(),
    category: `Category_${seq.current}`,
    displayOptions: { title: `Title ${seq.current}`, icon: `icon-${seq.current}.png`},
    enabled: true,
    installationOptions: {
      appSupport: '',
      category: `Category_${seq.current}`,
      countryList: [],
      description: `Description ${seq.current}`,
      developer: ` ${seq.current}`,
      languages: 'en, de',
      links: [],
      optionIcon: `icon-${seq.current}.png`,
      price: '0.00',
      pricingLink: '',
      website: '',
      wrapperType: '',
    },
    name: `Name_${seq.current}`,
    order: seq.current,
    reviews: [],
    scopes: [
      'read_products',
    ],
    timesInstalled: seq.current,
    versions: [],
  };
};

export const integrationFactory: PartialFactory<IntegrationInterface> = partialFactory(defaultFactory);
