import { Document } from 'mongoose';
import { ProductInterface } from '../interfaces';
import { BusinessProductIndustryModel } from './business-product-industry.model';

export interface BusinessProductModel extends Document, ProductInterface {
  industry: BusinessProductIndustryModel;
}
