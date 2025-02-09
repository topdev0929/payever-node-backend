import { BusinessInterface } from '../../business';

export interface IntegrationWrapperSubscriptionInterface {
  wrapperType: string;
  businessId?: string;
  business?: BusinessInterface;
  installed?: boolean;
  createdAt?: Date;
}
