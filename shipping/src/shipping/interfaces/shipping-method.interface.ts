import { IntegrationRuleInterface, IntegrationInterface } from '../../integration/interfaces';
import { BusinessInterface } from '../../business/interfaces';

export interface ShippingMethodInterface {
  business: BusinessInterface;
  businessId: string;
  integration?: IntegrationInterface;
  integrationRule?: IntegrationRuleInterface;
  serviceCode?: string;
}
