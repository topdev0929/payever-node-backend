import { ChannelsWithTransactionCountInterface } from '../interfaces';

export class ChannelsWithTransactionCountDto implements ChannelsWithTransactionCountInterface {
  public icon: string;
  public label: string;
  public name: string;
  public transactionCount: number;
}
