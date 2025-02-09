import { Document } from 'mongoose';
import { ProductInterface } from '../interfaces';

export interface ProductModel extends ProductInterface, Document {
    _id?: any;
}
