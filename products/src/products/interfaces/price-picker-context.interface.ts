import { PriceConditionFieldEnum } from '../enums';

export type PricePickerContext = {
  [key in PriceConditionFieldEnum]: string;
};
