export enum PaymentActionsEnum {
  REFUND = 'refund',
  CANCEL = 'cancel',
  EDIT = 'edit',
  SHIPPING_GOODS = 'shipping_goods',
  AUTHORIZE = 'authorize',
  VERIFY = 'verify',
  SETTLE = 'settle',
  CLAIM = 'claim',
  CLAIM_UPLOAD = 'claim_upload',
  CLAIM_CANCEL = 'claim_cancel',
  INVOICE = 'invoice',

  // Specific action for MM to skip validation
  SHIPPED = 'shipped',
}

export enum UrlActionsEnum {
  REFUND = 'refund',
  CANCEL = 'cancel',
  EDIT = 'edit',
  SHIPPING_GOODS = 'shipping-goods',
  AUTHORIZE = 'authorize',
  VERIFY = 'verify',
  SETTLE = 'settle',
  CLAIM = 'claim',
  CLAIM_UPLOAD = 'claim-upload',
  CLAIM_CANCEL = 'claim-cancel',
  INVOICE = 'invoice',

  // Specific action for MM to skip validation
  SHIPPED = 'shipped',
}

export const UrlActionsToPaymentActions: Map<string, string> = new Map<string, string>([
  [UrlActionsEnum.REFUND, PaymentActionsEnum.REFUND],
  [UrlActionsEnum.CANCEL, PaymentActionsEnum.CANCEL],
  [UrlActionsEnum.EDIT, PaymentActionsEnum.EDIT],
  [UrlActionsEnum.SHIPPING_GOODS, PaymentActionsEnum.SHIPPING_GOODS],
  [UrlActionsEnum.AUTHORIZE, PaymentActionsEnum.AUTHORIZE],
  [UrlActionsEnum.SHIPPED, PaymentActionsEnum.SHIPPED],
  [UrlActionsEnum.VERIFY, PaymentActionsEnum.VERIFY],
  [UrlActionsEnum.SETTLE, PaymentActionsEnum.SETTLE],
  [UrlActionsEnum.CLAIM, PaymentActionsEnum.CLAIM],
  [UrlActionsEnum.CLAIM_UPLOAD, PaymentActionsEnum.CLAIM_UPLOAD],
  [UrlActionsEnum.CLAIM_CANCEL, PaymentActionsEnum.CLAIM_CANCEL],
  [UrlActionsEnum.INVOICE, PaymentActionsEnum.INVOICE],
]);
