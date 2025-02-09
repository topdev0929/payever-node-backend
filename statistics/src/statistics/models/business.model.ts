import { Document } from 'mongoose';
import { BusinessInterface } from '../interfaces';
import { BusinessDetailModel } from '../schemas/business-detail.model';

export interface BusinessModel extends BusinessInterface, Document {
  businessDetail: BusinessDetailModel;
}
