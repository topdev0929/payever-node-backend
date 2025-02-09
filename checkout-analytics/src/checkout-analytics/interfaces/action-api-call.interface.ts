export interface ActionApiCallInterface {
  businessId?: string;
  paymentId?: string;
  action?: string;
  status?: string;
  error?: string;
  executionTime?: number;

  readonly createdAt: Date;
  readonly updatedAt: Date;
}
