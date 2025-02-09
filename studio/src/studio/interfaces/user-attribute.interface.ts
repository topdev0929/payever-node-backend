import { AttributeInterface } from './attribute.interface';
import { ShowOnEnum } from '../enums';

export interface UserAttributeInterface extends AttributeInterface {
  businessId: string;
  filterAble?: boolean;
  onlyAdmin?: boolean;
  showOn?: ShowOnEnum;
  defaultValue?: string;
  userAttributeGroup?: string;
}
