import { ShopInterface } from './shop.interface';
import { Document } from 'mongoose';

export interface ShopModel extends ShopInterface, Document {
}
