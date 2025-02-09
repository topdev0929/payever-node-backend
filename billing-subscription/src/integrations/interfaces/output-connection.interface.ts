import { IntegrationInterface } from './integration.interface';

export interface OutputConnectionInterface {
  _id: string;
  integration: IntegrationInterface;
  isEnabled: boolean;
}
