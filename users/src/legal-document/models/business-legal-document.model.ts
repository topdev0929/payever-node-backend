import { Document } from 'mongoose';
import { BusinessModel } from '../../user/models';
import { BusinessLegalDocumentInterface } from '../interfaces';

export interface BusinessLegalDocumentModel extends BusinessLegalDocumentInterface, Document {
  business: BusinessModel;
}
