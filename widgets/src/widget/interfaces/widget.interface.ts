import { TutorialInterface } from './tutorial.interface';

export interface WidgetInterface {
  readonly type: string;
  readonly icon: string;
  readonly title: string;
  readonly default: boolean;
  readonly helpURL: string;
  readonly tutorial: TutorialInterface;
  readonly order: number;
  readonly installByDefault?: boolean;
}
