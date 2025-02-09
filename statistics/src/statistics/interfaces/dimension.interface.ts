import { DimensionEnum, SizeValueEnum, WidgetTypeEnum } from '../enums';

export interface DimensionInterface {
  name: DimensionEnum;
  field: string;
  sizes: SizeValueEnum[];
  types: WidgetTypeEnum[];
}
