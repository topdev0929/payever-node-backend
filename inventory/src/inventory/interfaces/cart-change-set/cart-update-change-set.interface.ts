import { CartItemDto } from '../../dto/api';
import { InventoryModel, ReservationModel } from '../../models';

export interface CartUpdateChangeSetInterface {
  readonly reservation: ReservationModel;
  readonly item: CartItemDto;
  readonly inventory: InventoryModel;
}
