import { Document } from 'mongoose';
import { UserAttributeGroupInterface } from '../interfaces';

export interface UserAttributeGroupModel extends UserAttributeGroupInterface, Document {
}
