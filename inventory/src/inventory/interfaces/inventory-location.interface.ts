import { InventoryInterface } from './inventory.interface';
import { LocationInterface } from './location.interface';

export interface InventoryLocationInterface {
  locationId: string;
  location?: LocationInterface;
  inventoryId: string;
  inventory?: InventoryInterface;
  stock: number;
}
