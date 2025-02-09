export interface PaymentItemInterface {
  readonly createdAt: Date;
  readonly extraData?: any[];
  readonly identifier?: string;
  readonly name: string;
  readonly options?: any[];
  readonly price: number;
  readonly priceNet?: number;
  readonly productId?: string;
  readonly quantity: number;
  readonly sku?: string;
  readonly updatedAt?: Date;
  readonly vatRate?: number;
}
