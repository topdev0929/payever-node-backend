import { Document } from 'mongoose';
import { SectionInterface } from '../interfaces';

export interface SectionModel extends SectionInterface, Document {
  _id: string;
}
