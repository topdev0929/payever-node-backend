import { Document } from 'mongoose';

import { ContentInterface } from '../interfaces';

export interface ContentModel extends ContentInterface, Document {
  _id?: string;
}
