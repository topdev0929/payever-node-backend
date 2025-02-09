import { WidgetModel } from '..';

export interface WidgetInstallationStateInterface {
  readonly widget: WidgetModel;
  readonly installed: boolean;
  readonly order: number;
}
