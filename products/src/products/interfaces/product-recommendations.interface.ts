import { RecommendationTagsEnum } from '../enums';

export interface ProductRecommendationsInterface {
  tag: RecommendationTagsEnum;
  recommendations: Array<{
    id: string;
    images?: string[];
    name: string;
    sku?: string;
  }>;
}
