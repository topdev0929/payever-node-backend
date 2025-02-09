import { Document } from 'mongoose';
import { ProductSettingsInterface } from '../interfaces/product-settings.interface';

export interface ProductSettingsModel extends ProductSettingsInterface, Document {

}
