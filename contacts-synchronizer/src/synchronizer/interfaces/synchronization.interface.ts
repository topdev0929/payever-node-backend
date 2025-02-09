import { BusinessInterface } from '@pe/business-kit';

export interface SynchronizationInterface {
  business?: BusinessInterface;
  businessId: string;
  isInwardEnabled?: boolean;
  isOutwardEnabled?: boolean;
  lastSynced?: Date;
}
