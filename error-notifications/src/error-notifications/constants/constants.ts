import { ErrorNotificationTypesEnum } from '../enums';

export const EMAIL_TRANSFORMER: string = 'email_transformer';

export const IntegrationRelatedErrorTypes: ErrorNotificationTypesEnum[] = [
  ErrorNotificationTypesEnum.paymentOptionCredentialsInvalid,
  ErrorNotificationTypesEnum.lastTransactionTime,
];

export const SendingByCronUpdateIntervalErrorTypes: ErrorNotificationTypesEnum[] = [
  ErrorNotificationTypesEnum.apiKeysInvalid,
  ErrorNotificationTypesEnum.paymentNotificationFailed,
  ErrorNotificationTypesEnum.pspApiFailed,
  ErrorNotificationTypesEnum.paymentOptionCredentialsInvalid,
  ErrorNotificationTypesEnum.thirdPartyError,
];

export const SendingByAfterIntervalErrorTypes: ErrorNotificationTypesEnum[] = [
  ErrorNotificationTypesEnum.lastTransactionTime,
];

