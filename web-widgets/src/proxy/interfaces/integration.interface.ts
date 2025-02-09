import { InnerActionInterface } from './';

export interface IntegrationInterface {
  readonly code: string;
  readonly url: string;
  readonly actions: InnerActionInterface[];
}
