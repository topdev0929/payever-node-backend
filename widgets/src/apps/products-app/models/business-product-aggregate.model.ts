import { Document } from 'mongoose';
import { BusinessModel } from '../../../business/models';
import { BusinessProductAggregateInterface } from '../interfaces';

export interface BusinessProductAggregateModel extends BusinessProductAggregateInterface, Document {
  business?: BusinessModel;
}
