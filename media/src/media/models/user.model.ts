import { Document, Types } from 'mongoose';
import { UserInterface } from '../interfaces';
import { MediaModel } from './media.model';

export interface UserModel extends UserInterface, Document {
}
