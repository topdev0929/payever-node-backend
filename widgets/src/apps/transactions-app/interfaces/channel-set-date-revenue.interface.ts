import { ChannelSetInterface } from '../../../statistics/interfaces';
import { DateRevenueInterface } from './date-revenue.interface';

export interface ChannelSetDateRevenueInterface extends DateRevenueInterface {
  channelSet: ChannelSetInterface;
}
