import { ListTypeEnum } from '../enums';

export interface FraudListInterface {
  _id?: any;
  businessId?: string;
  name: string;
  description?: string;
  type: ListTypeEnum;
  values: any[];
}
