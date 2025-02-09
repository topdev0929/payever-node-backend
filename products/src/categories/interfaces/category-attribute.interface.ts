import { AttributeTypesEnum } from '../enums';

export interface CategoryAttributeInterface {
  name: string;
  isDefault: boolean;
  type: AttributeTypesEnum;
}
