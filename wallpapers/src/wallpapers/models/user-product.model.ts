import { Document } from 'mongoose';
import { ProductInterface } from '../interfaces';
import { UserProductIndustryModel } from './user-product-industry.model';

export interface UserProductModel extends Document, ProductInterface {
  industry: UserProductIndustryModel;
}
