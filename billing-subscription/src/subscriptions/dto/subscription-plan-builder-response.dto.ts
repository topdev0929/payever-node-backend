import { BusinessModel } from '@pe/business-kit/modules';
import { BillingIntervalsEnum, PlanTypeEnum } from '../enums';
import { ProductModel } from '../models';

export class SubscriptionPlanBuilderResponseDto {
  public billingPeriod: number;
  public business: BusinessModel;
  public currency: string;
  public id: string;
  public interval: BillingIntervalsEnum;
  public name: string;
  public planType: PlanTypeEnum;
  public products: ProductModel[] | string[];
  public totalPrice: number;
}
