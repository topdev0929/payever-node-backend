import { DisplayOptionsInterface } from './display-options.interface';

export interface IntegrationInterface {
  readonly name: string;
  readonly category: string;
  readonly displayOptions: DisplayOptionsInterface;
}
