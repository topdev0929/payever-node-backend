export interface CartItemInterface {
  name: string;
  price: number;
  priceNetto?: number;
  vatRate?: number;
  quantity: number;
  identifier: string;
  description?: string;
  sku?: string;
  thumbnail?: string;
  url?: string;
}
