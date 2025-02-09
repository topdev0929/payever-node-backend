import { ToggleIntegrationSubscriptionDto } from '@pe/synchronizer-kit';

export interface ToggleIntegrationSubscriptionLocalDto extends ToggleIntegrationSubscriptionDto {
  isInwardEnabled: boolean;
  isOutwardEnabled: boolean;
}
