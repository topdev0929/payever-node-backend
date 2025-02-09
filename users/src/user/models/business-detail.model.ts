import { Document } from 'mongoose';
import { BusinessDetailInterface } from '../interfaces';

export const BusinessDetailModelName: string = 'BusinessDetailModel';

export interface BusinessDetailModel extends BusinessDetailInterface, Document {
}
