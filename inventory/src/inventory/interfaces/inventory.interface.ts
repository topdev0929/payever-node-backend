import { BusinessInterface } from '@pe/business-kit';
import { InventoryLocationModel } from '../models';


export interface InventoryInterface {
  product: string;
  business?: BusinessInterface;
  businessId: string;
  stock: number;
  lowStock?: number;
  emailLowStock?: boolean;
  sku: string;
  barcode: string;
  reserved: number;
  inventoryLocations?: InventoryLocationModel[];
  origin: string;
  originalInventory?: {
    businessId: string;
    sku: string;
  };
}
