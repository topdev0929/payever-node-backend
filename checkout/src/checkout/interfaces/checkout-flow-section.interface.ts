import { SubsectionInterface } from '..';
import { CheckoutSection } from '../../integration';

export interface CheckoutFlowSectionInterface {
  code: CheckoutSection;
  fixed: boolean;
  enabled: boolean;
  order: number;
  excluded_channels: string[];
  allowed_only_channels: string[];
  allowed_only_integrations: string[];
  excluded_integrations: string[];
  subsections: SubsectionInterface[];
}
