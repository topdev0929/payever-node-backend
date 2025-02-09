import { ProductInterface } from '../interfaces/products.interface';
import { Document } from 'mongoose';

export interface ProductModel extends ProductInterface, Document  { }
