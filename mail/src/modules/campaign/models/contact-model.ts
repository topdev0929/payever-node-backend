import { Document } from 'mongoose';
import { ContactInterface } from '../interfaces';

export interface ContactModel extends ContactInterface, Document {
  id: string;
}
