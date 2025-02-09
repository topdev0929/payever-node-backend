export class ProductSkuUpdatedDto {
  public originalSku: string;
  public updatedSku: string;
  public business: {
    id: string;
  };
}
