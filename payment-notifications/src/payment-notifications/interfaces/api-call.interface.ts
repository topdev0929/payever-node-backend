export interface ApiCallInterface {
  cancelUrl?: string;
  customerRedirectUrl?: string;
  failureUrl?: string;
  noticeUrl?: string;
  pendingUrl?: string;
  successUrl?: string;

  paymentId?: string;
  businessId?: string;
  clientId?: string;
}
