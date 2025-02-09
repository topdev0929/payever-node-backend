import { WidgetInterface } from './widget.interface';

export interface WidgetInstallationInterface {
  readonly widget: WidgetInterface;
  readonly installed: boolean;
  readonly order: number;
}
