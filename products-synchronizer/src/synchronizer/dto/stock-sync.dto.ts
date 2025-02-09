export class StockSyncDto {
  public businessId: string;
  public business: {
    id: string;
  };
  public integration?: {
    name: string;
  };

  public synchronizationTask?: {
    id: string;
  };

  public barcode?: string;
  public sku: string;
  public stock?: number;
  public origin: string;
  public isNegativeStockAllowed?: boolean;
}
