import { Document } from 'mongoose';
import { ProductIndustryInterface } from '../interfaces';

export interface UserProductIndustryModel extends Document, ProductIndustryInterface {
}
