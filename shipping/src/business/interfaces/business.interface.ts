import { Document } from 'mongoose';
import { IntegrationSubscriptionInterface } from '../../integration/interfaces';
import { ShippingSettingInterface } from '../../shipping/interfaces';
import { CompanyAddressInterface } from '@pe/business-kit';

export interface BusinessInterface extends Document {
  integrationSubscriptions: IntegrationSubscriptionInterface[];
  companyAddress?: CompanyAddressInterface;
  currency?: string;
  name?: string;
  settings: ShippingSettingInterface[];
  createdAt?: string;
}
