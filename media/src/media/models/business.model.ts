import { Document, Types } from 'mongoose';
import { BusinessInterface } from '../interfaces';
import { MediaModel } from './media.model';

export interface BusinessModel extends BusinessInterface, Document {
}
