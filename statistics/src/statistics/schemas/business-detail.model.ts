import { Document } from 'mongoose';
import { BusinessDetailInterface } from '../interfaces/business-detail.interface';

export const BusinessDetailModelName: string = 'BusinessDetailModel';

export interface BusinessDetailModel extends BusinessDetailInterface, Document {
}
