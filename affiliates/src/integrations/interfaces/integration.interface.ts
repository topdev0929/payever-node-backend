import { DisplayOptionsInterface } from './display-options.interface';

export interface IntegrationInterface {
  readonly autoEnable?: boolean;
  readonly name: string;
  readonly category: string;
  readonly displayOptions: DisplayOptionsInterface;
  readonly isVisible: boolean;
}
