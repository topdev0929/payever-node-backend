import { Document } from 'mongoose';
import { UserMediaInterface } from '../interfaces';

export interface UserMediaModel extends UserMediaInterface, Document {
}
