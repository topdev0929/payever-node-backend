export interface PaymentMethodMigrationMappingInterface {
  paymentMethodFrom: string;
  paymentMethodTo: string;
  businessId?: string;
  enabled: boolean;
}
