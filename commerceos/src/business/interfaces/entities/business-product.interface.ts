import { BusinessProductIndustryInterface } from './business-product-industry.interface';
import { BusinessStatusesEnum } from '../../enums';

export interface BusinessProductIndustryInterfac {
  readonly code: string;
  defaultBusinessStatus: BusinessStatusesEnum;
  wallpaper: string;
  logo: string;
  slug: string;
  industry: BusinessProductIndustryInterface;
}
