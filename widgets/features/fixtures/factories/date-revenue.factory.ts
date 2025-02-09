import {
  partialFactory,
  PartialFactory,
  DefaultFactory,
} from '@pe/cucumber-sdk';
import { v4 } from 'uuid';

export const dateRevenueDefaultFactory: DefaultFactory<any> = (): any => {
  return ({
    amount: 123.0,
    currency: 'EUR',
    date: new Date(),
  });
};

export const dateRevenueFactory: PartialFactory<any> = partialFactory<any>(dateRevenueDefaultFactory);

export const channelSetDateRevenueDefaultFactory: DefaultFactory<any> = (): any => ({
  ...dateRevenueDefaultFactory(),
  channelSet: v4(),
});

export const channelSetDateRevenueFactory: PartialFactory<any>
  = partialFactory<any>(channelSetDateRevenueDefaultFactory);

export const businessDateRevenueDefaultFactory: DefaultFactory<any> = (): any => ({
  ...dateRevenueDefaultFactory(),
  businessId: v4(),
});

export const businessDateRevenueFactory: PartialFactory<any> = partialFactory<any>(businessDateRevenueDefaultFactory);

export const userDateRevenueDefaultFactory: DefaultFactory<any> = (): any => ({
  ...dateRevenueDefaultFactory(),
  user: v4(),
});

export const userDateRevenueFactory: PartialFactory<any> = partialFactory<any>(userDateRevenueDefaultFactory);
