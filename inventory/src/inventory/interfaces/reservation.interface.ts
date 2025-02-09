import { InventoryInterface } from './inventory.interface';

export interface ReservationInterface {
  businessId: string;
  inventory: InventoryInterface;
  quantity: number;
}
