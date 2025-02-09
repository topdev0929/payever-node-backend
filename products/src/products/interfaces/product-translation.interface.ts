import { TranslationInterface } from '../interfaces';
import { Document } from 'mongoose';

export interface ProductTranslationInterface extends Document {
  product: string;
  translations: { [key: string] : TranslationInterface };
}
