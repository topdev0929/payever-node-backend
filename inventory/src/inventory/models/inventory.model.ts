import { Document } from 'mongoose';
import { BusinessModel } from '../../business/models';

import { InventoryInterface, InventorySettingsInterface } from '../interfaces';

export interface InventoryModel extends InventoryInterface, InventorySettingsInterface, Document {
  business?: BusinessModel;
}
