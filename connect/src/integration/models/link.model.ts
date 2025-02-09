import { Document } from 'mongoose';
import { LinkInterface } from '../interfaces';

export interface LinkModel extends LinkInterface, Document {
  readonly type: string;
  readonly url: string;
}
