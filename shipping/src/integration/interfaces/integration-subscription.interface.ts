import { IntegrationInterface } from './integration.interface';
import { IntegrationRuleInterface } from './rules';

export interface IntegrationSubscriptionInterface {
  integration: IntegrationInterface;
  rules?: IntegrationRuleInterface[];
  installed?: boolean;
  enabled?: boolean;
}
