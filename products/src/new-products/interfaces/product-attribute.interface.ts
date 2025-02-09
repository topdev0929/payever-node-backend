import { AttributeTypesEnum } from '../../categories/enums';

export interface ProductAttributeInterface {
  name: string;
  type: AttributeTypesEnum;
  value: string;
}
