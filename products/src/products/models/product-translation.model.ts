import { Document } from 'mongoose';
import { ProductTranslationInterface } from '../interfaces';

export interface ProductTranslationModel extends ProductTranslationInterface, Document {
}
