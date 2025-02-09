import { Document } from 'mongoose';
import { LocationModel } from './location.model';

import { InventoryLocationInterface } from '../interfaces';

export interface InventoryLocationModel extends InventoryLocationInterface, Document {
  location?: LocationModel;
}
