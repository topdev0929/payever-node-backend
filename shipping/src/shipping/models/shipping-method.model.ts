import { ShippingMethodInterface } from '../interfaces';
import { Document } from 'mongoose';
import { BusinessModel } from '../../business/models';
import { IntegrationModel, IntegrationRuleModel } from '../../integration/models';

export interface ShippingMethodModel extends ShippingMethodInterface, Document {
  business: BusinessModel;
  integration?: IntegrationModel;
  integrationRule?: IntegrationRuleModel;
}
