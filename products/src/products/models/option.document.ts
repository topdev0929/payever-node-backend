import { Document } from 'mongoose';
import { OptionInterface } from '../interfaces';

export interface OptionDocument extends OptionInterface, Document<string> {
  _id: string;
}
