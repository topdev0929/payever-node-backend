export class AggregatedTransactionsResultDto {
  public paymentMethod: string;
  public currency: string;
  public count: number;
  public total: number;
  public businesses: string[];
}
