import { Document } from 'mongoose';

import { ProductIndustryInterface } from '../interfaces';

export interface BusinessProductIndustryModel extends Document, ProductIndustryInterface {
}
