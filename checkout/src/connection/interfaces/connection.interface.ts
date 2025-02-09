import { IntegrationInterface } from '../../integration/interfaces';
import { ConnectionOptionsInterface } from './connection-options.interface';

export interface ConnectionInterface {
  businessId?: string;
  integration?: IntegrationInterface;
  name: string;
  options?: ConnectionOptionsInterface;
  mappedReference?: string;

  isBpoActive?: boolean;
}
