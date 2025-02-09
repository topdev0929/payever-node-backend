import { Document } from 'mongoose';
import { BusinessProductIndustryInterfac } from './business-product.interface';

export interface BusinessProductModel extends Document, BusinessProductIndustryInterfac { }
