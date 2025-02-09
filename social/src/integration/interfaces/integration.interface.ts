import { DisplayOptionsInterface } from './display-options.interface';

export interface IntegrationInterface {
  name: string;
  category: string;
  enabled: boolean;
  displayOptions: DisplayOptionsInterface;
}
