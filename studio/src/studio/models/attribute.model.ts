import { Document } from 'mongoose';
import { AttributeInterface } from '../interfaces';

export interface AttributeModel extends AttributeInterface, Document {
}
