import { TrainedDataInterface } from './trained-data.interface';
import { Document } from 'mongoose';

export interface TrainedDataModel extends TrainedDataInterface, Document {
  updatedAt: Date;
}
