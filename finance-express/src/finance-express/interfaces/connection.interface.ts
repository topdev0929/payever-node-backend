import { BusinessInterface } from '../../business/interfaces';

export interface ConnectionInterface {
  business?: BusinessInterface;
  name: string;
  options?: {
  };

  isBpoActive?: boolean;
}
