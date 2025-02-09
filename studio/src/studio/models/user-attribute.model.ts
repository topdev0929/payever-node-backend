import { Document } from 'mongoose';
import { UserAttributeInterface } from '../interfaces';

export interface UserAttributeModel extends UserAttributeInterface, Document {
}
