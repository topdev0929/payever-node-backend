import { InventoryModel, ReservationModel } from '../../models';
import { InventoryQuantityChangeInterface } from './inventory-quantity-change.interface';

export interface UpdatedReservationInterface {
  readonly reservation: ReservationModel;
  readonly changeSet: InventoryQuantityChangeInterface;
  readonly inventory: InventoryModel;
}
