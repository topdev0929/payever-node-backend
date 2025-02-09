import { Document } from 'mongoose';
import { BusinessDetailInterface } from '../interfaces';

export interface BusinessDetailModel extends BusinessDetailInterface, Document {
}
