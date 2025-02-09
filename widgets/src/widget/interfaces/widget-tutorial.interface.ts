import { WidgetInterface } from './widget.interface';

export interface WidgetTutorialInterface {
  readonly widget: WidgetInterface;
  readonly watched: boolean;
  readonly order: number;
}
