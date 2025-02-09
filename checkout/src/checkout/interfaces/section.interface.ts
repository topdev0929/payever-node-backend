import { CheckoutSection } from '../../integration';

export interface SectionRuleInterface {
  _id?: string;
  type: string;
  property?: string;
  operator?: string;
  value?: number;
}

export interface SubsectionInterface {
  _id?: string;
  code: string;
  rules?: SectionRuleInterface[];
}

export interface SectionInterface {
  _id?: string;
  code: CheckoutSection;
  fixed: boolean;
  defaultEnabled: boolean;
  options?: {
    skipButton?: boolean;
  };
  order?: number;
  excluded_channels: string[];
  allowed_only_channels?: string[];
  allowed_only_integrations: string[];
  excluded_integrations: string[];
  subsections: SubsectionInterface[];
}
