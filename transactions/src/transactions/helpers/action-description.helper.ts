import { PaymentActionsEnum } from '../enum';
const translationKey: string = 'transactions.actions.';
const descriptionKey: string = '.description';

export const ActionDescriptionHelper: { [key in PaymentActionsEnum]?: string } = {
  [PaymentActionsEnum.ShippingGoods]:
    `${translationKey}${PaymentActionsEnum.ShippingGoods}${descriptionKey}`,
  [PaymentActionsEnum.Return]:
    `${translationKey}${PaymentActionsEnum.Return}${descriptionKey}`,
  [PaymentActionsEnum.Authorize]:
    `${translationKey}${PaymentActionsEnum.Authorize}${descriptionKey}`,
  [PaymentActionsEnum.Capture]:
    `${translationKey}${PaymentActionsEnum.Capture}${descriptionKey}`,
  [PaymentActionsEnum.Collection]:
    `${translationKey}${PaymentActionsEnum.Collection}${descriptionKey}`,
  [PaymentActionsEnum.LatePayment]:
    `${translationKey}${PaymentActionsEnum.LatePayment}${descriptionKey}`,
  [PaymentActionsEnum.Paid]:
    `${translationKey}${PaymentActionsEnum.Paid}${descriptionKey}`,
  [PaymentActionsEnum.Remind]:
    `${translationKey}${PaymentActionsEnum.Remind}${descriptionKey}`,
  [PaymentActionsEnum.Upload]:
    `${translationKey}${PaymentActionsEnum.Upload}${descriptionKey}`,
  [PaymentActionsEnum.EditDelivery]:
    `${translationKey}${PaymentActionsEnum.EditDelivery}${descriptionKey}`,
  [PaymentActionsEnum.EditReference]:
    `${translationKey}${PaymentActionsEnum.EditReference}${descriptionKey}`,
  [PaymentActionsEnum.Verify]:
    `${translationKey}${PaymentActionsEnum.Verify}${descriptionKey}`,
  [PaymentActionsEnum.SendSigningLink]:
    `${translationKey}${PaymentActionsEnum.SendSigningLink}${descriptionKey}`,
  [PaymentActionsEnum.SigningLinkQr]:
    `${translationKey}${PaymentActionsEnum.SigningLinkQr}${descriptionKey}`,
  [PaymentActionsEnum.MarkPaid]:
    `${translationKey}${PaymentActionsEnum.MarkPaid}${descriptionKey}`,
};
