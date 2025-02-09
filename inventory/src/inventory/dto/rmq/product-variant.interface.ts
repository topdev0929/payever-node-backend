export interface ProductVariantInterface {
  id: string;
  images?: string[];
  title: string;
  description: string;
  hidden: boolean;
  price: number;
  salePrice: number;
  sku: string;
  inventory?: string;
  inventoryTrackingEnabled?: boolean;
  barcode: string;
}
