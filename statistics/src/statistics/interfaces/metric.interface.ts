import { MetricEnum, SizeValueEnum, WidgetTypeEnum } from '../enums';

export interface MetricInterface {
  name: MetricEnum;
  sizes: SizeValueEnum[];
  types: WidgetTypeEnum[];
  group?: string;
  suffix?: string;
}
