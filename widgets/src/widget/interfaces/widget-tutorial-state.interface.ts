import { WidgetModel } from '..';

export interface WidgetTutorialStateInterface {
  readonly widget: WidgetModel;
  readonly watched: boolean;
  readonly order: number;
}
