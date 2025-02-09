import { FraudListInterface } from '../interfaces';
import { ListTypeEnum } from '../enums';

export class FraudListDto implements FraudListInterface{
  public _id?: string;
  public businessId?: string;
  public name: string;
  public description?: string;
  public type: ListTypeEnum;
  public values: any[];
}
