import { Document } from 'mongoose';
import { BusinessModule } from '../../business';
import { ReservationInterface } from '../interfaces';
import { InventoryModel } from './inventory.model';

export interface ReservationModel extends ReservationInterface, Document {
  business?: BusinessModule;
  inventory: InventoryModel;
}
