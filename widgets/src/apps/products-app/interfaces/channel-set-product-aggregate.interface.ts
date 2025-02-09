import { ChannelSetInterface } from '../../../statistics/interfaces';
import { ProductInterface } from './product.interface';

export interface ChannelSetProductAggregateInterface extends ProductInterface {
  channelSet: ChannelSetInterface;
}
