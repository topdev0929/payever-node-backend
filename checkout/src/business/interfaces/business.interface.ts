import { ChannelSetInterface } from '../../channel-set';
import { CheckoutInterface } from '../../checkout';
import { BusinessDetailInterface } from './business-detail.interface';

export interface BusinessInterface {
  readonly channelSets: ChannelSetInterface[] | string[];
  readonly checkouts: CheckoutInterface[] | string[];

  currency?: string;
  country?: string;
  businessDetail?: BusinessDetailInterface | string;

  name?: string;
  slug?: string;

  createdAt?: string;
  updatedAt?: string;

  defaultLanguage?: string;
}
