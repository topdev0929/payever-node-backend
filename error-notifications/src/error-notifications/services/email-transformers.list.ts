import { EmailTransformerCollector } from './email-transformers/email-transformer.collector';
import {
  PaymentNotificationFailedTransformer,
  PspApiFailedTransformer,
  ApiKeysInvalidTransformer,
  PaymentOptionCredentialsInvalidTransformer,
  LastTransactionTimeTransformer,
  ThirdpartyErrorTransformer,
} from './email-transformers/transformers/';

export const EmailTransformersList: any[] = [
  EmailTransformerCollector,
  PaymentNotificationFailedTransformer,
  PspApiFailedTransformer,
  PaymentOptionCredentialsInvalidTransformer,
  ApiKeysInvalidTransformer,
  LastTransactionTimeTransformer,
  ThirdpartyErrorTransformer,
];
