import {
  partialFactory,
  uniqueString,
  PartialFactory,
  DefaultFactory,
} from '@pe/cucumber-sdk';
import { v4 } from 'uuid';

export const channelSetDefautFactory: DefaultFactory<any> = (): any => {
  return ({
    _id: v4(),
    active: true,
    businessId: v4(),
    currency: 'EUR',
    name: `Campaign ${uniqueString()}`,
    revenue: 100.0,
    sells: 5,
    type: `some-type`,
  });
};

export const channelSetFactory: PartialFactory<any> = partialFactory<any>(channelSetDefautFactory);
