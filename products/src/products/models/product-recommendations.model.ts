import { Document } from 'mongoose';
import { ProductRecommendationsInterface } from '../interfaces';

export interface ProductRecommendationsModel extends ProductRecommendationsInterface, Document {
  businessId: string;
  productId: string;
  sku: string;
}
