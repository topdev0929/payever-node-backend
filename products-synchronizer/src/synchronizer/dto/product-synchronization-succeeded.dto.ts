export class ProductSynchronizationSucceededDto {
  public product: {
    sku: string;
  };

  public synchronizationTask: {
    id: string;
  };
}
