export interface PaymentLinkFolderItemInterface {
  _id: string;
  serviceEntityId?: string;
  businessId: string;
  amount:  number;
  createdAt: Date;
  expiresAt: Date;
  isActive: boolean;
  paymentLink?: string;
}
