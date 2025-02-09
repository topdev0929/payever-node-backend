export class ProductSynchronizationFailedDto {
  public product: {
    sku: string;
  };

  public synchronizationTask: {
    id: string;
  };

  public errorMessage: string;
}
