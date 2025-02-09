import { WidgetTypeEnum } from '../enums';

export interface WidgetPropsInterface {
  widgetType: WidgetTypeEnum;
  props: WidgetPropInterface[];
}

export interface WidgetPropInterface {
  name: string;
  query: any;
}
