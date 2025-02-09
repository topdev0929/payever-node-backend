import { DashboardInterface } from './dashboard.interface';
import { WidgetSettingInterface } from './widget-setting.interface';
import { CreatedByEnum, WidgetTypeEnum } from '../enums';
import { ViewTypeValueEnum } from '../enums/wigdet-setting-type-values';

export interface WidgetInterface {
  name: string;
  size: string;
  type: WidgetTypeEnum;
  dashboard: DashboardInterface;
  viewType: ViewTypeValueEnum;
  widgetSettings: WidgetSettingInterface[] | WidgetSettingInterface[][] | WidgetSettingInterface[][][];
  createdBy?: CreatedByEnum;
}
