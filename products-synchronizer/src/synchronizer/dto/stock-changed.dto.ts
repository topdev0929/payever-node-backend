export class StockChangedDto {
  public business: {
    id: string;
  };
  public integration?: {
    name: string;
  };
  public sku: string;
  public quantity: number;
  public stock?: number;
}
