import { Document } from 'mongoose';
import { BusinessProductIndustryInterface } from './business-product-industry.interface';

export interface BusinessProductIndustryModel extends Document, BusinessProductIndustryInterface {
}
