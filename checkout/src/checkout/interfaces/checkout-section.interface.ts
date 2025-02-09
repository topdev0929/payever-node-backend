import { CheckoutSection } from '../../integration';

export interface CheckoutSectionInterface {
  code: CheckoutSection;
  order?: number;
  enabled?: boolean;
  options?: { 
    skipButton?: boolean;
  };
}
