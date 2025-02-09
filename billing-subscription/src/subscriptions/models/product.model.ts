import { Document } from 'mongoose';
import { ProductInterface } from '../interfaces/entities';
import { BusinessModel } from '../../business/interfaces';

export interface ProductModel extends ProductInterface, Document {
  _id: string;
  business?: BusinessModel;
}
