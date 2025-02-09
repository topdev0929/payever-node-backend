import { Document, Types } from 'mongoose';
import { BusinessInterface } from '../interfaces';
import { IntegrationSubscriptionModel } from '../../integration/models';
import { ShippingSettingModel } from '../../shipping/models';

export interface BusinessModel extends BusinessInterface, Document {
  integrationSubscriptions: Types.DocumentArray<IntegrationSubscriptionModel>;
  settings: Types.DocumentArray<ShippingSettingModel>;
}
