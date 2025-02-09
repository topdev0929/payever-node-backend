import { SubscriptionMediaModel } from '../models';

export class SubscriptionMediaListDto {
  public limit?: number;
  public offset?: number;
  public total: number;
  public list: SubscriptionMediaModel[];
}
