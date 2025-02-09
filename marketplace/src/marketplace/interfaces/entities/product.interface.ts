import { BusinessInterface } from '@pe/business-kit';
import { ChannelSetInterface } from '@pe/channels-sdk';
import { ProductRatingInterface } from '../product-rating.interface';

export interface ProductInterface {
  business?: BusinessInterface;
  businessId: string;
  country: string;
  currency: string;
  price: number;
  title: string;
  type: string;
  rating: ProductRatingInterface;
  imports: number;
  channelSet: ChannelSetInterface;
}
