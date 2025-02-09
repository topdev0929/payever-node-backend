export interface PaymentMailInterface {
  serviceEntityId?: string;
  to: string;
  cc?: string[];
  locale: string;
  template_name: string;
  business: any;
  variables?: any;
}
