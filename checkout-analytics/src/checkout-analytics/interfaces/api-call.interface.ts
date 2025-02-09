export interface ApiCallInterface {
  businessId?: string;
  paymentId?: string;
  paymentMethod?: string;
  channel?: string;
  channelSetId?: string;
  amount?: number;
  currency?: string;
  executionTime?: number;

  readonly createdAt: Date;
  readonly updatedAt: Date;
}
