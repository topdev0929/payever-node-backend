import { Document } from 'mongoose';
import { GroupInterface } from '../interfaces';

export interface GroupModel extends GroupInterface, Document {
  _id: string;
}
