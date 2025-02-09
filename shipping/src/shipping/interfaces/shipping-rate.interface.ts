import { IntegrationInterface } from '../../integration/interfaces';
import { CreatedByEnum, RateTypesEnums, WeightUnitEnums } from '../enums';
import { ShippingSpeedEnum } from '../enums/shipping-speed.enum';

export interface ShippingRateInterface {
  name?: string;
  rateType?: RateTypesEnums;
  integration: IntegrationInterface;
  minPrice?: number;
  maxPrice?: number;
  ratePrice?: number;
  weightUnit?: WeightUnitEnums;
  minWeight?: number;
  maxWeight?: number;
  serviceCode?: string;
  shippingSpeed?: ShippingSpeedEnum;
  autoShow?: boolean; 
  createdBy?: CreatedByEnum;
}
