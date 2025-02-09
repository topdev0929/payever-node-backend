import { FilterFieldMapping } from '../../common/helpers';

export enum PlanFilterFieldEnum {
  Id = 'id',
  Name = 'name',
  Business = 'business',
  PlanType = 'planType',
  BillingPeriod = 'billingPeriod',
  Interval = 'interval',
}

export const PlanFilterFieldsMapping: FilterFieldMapping<PlanFilterFieldEnum> = {
  [PlanFilterFieldEnum.Id]: '_id',
  [PlanFilterFieldEnum.Name]: 'name',
  [PlanFilterFieldEnum.Business]: 'business',
  [PlanFilterFieldEnum.PlanType]: 'planType',
  [PlanFilterFieldEnum.BillingPeriod]: 'billingPeriod',
  [PlanFilterFieldEnum.Interval]: 'interval',
};
