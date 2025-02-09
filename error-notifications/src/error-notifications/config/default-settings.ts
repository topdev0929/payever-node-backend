// tslint:disable:object-literal-sort-keys
import { DefaultSettingsDto } from '../dto';
import { CronUpdateIntervalEnum, ErrorNotificationTypesEnum, PaymentMethodsEnum, SendingMethodEnum } from '../enums';

export const DefaultSettings: DefaultSettingsDto[] = [
  // Business related options / General Options
  {
    isEnabled: false,
    repeatFrequencyInterval: 0,
    sendingMethod: SendingMethodEnum.sendByCronInterval,
    type: ErrorNotificationTypesEnum.apiKeysInvalid,
    updateInterval: CronUpdateIntervalEnum.every5minutes,
  },
  {
    isEnabled: false,
    repeatFrequencyInterval: 5,
    sendingMethod: SendingMethodEnum.sendByCronInterval,
    type: ErrorNotificationTypesEnum.paymentNotificationFailed,
    updateInterval: CronUpdateIntervalEnum.everyHour,
  },
  {
    isEnabled: false,
    repeatFrequencyInterval: 0,
    sendingMethod: SendingMethodEnum.sendByCronInterval,
    type: ErrorNotificationTypesEnum.pspApiFailed,
    updateInterval: CronUpdateIntervalEnum.every5minutes,
  },

  // Payment method related options
  // santanderDeInstallment
  {
    isEnabled: false,
    integration: PaymentMethodsEnum.santanderDeInstallment,
    repeatFrequencyInterval: 0,
    sendingMethod: SendingMethodEnum.sendByCronInterval,
    type: ErrorNotificationTypesEnum.paymentOptionCredentialsInvalid,
    updateInterval: CronUpdateIntervalEnum.every5minutes,
  },
  {
    isEnabled: false,
    integration: PaymentMethodsEnum.santanderDeInstallment,
    sendingMethod: SendingMethodEnum.sendByAfterInterval,
    timeFrames: [
      {
        startDayOfWeek: 1,
        startHour: 9,
        startMinutes: 0,

        endDayOfWeek: 5,
        endHour: 18,
        endMinutes: 0,

        sendEmailAfterInterval: 60,
        repeatFrequencyInterval: 0,
      },
    ],
    type: ErrorNotificationTypesEnum.lastTransactionTime,
  },

  // santanderDeInvoice
  {
    isEnabled: false,
    integration: PaymentMethodsEnum.santanderDeInvoice,
    repeatFrequencyInterval: 0,
    sendingMethod: SendingMethodEnum.sendByCronInterval,
    type: ErrorNotificationTypesEnum.paymentOptionCredentialsInvalid,
    updateInterval: CronUpdateIntervalEnum.every5minutes,
  },
  {
    isEnabled: false,
    integration: PaymentMethodsEnum.santanderDeInvoice,
    sendingMethod: SendingMethodEnum.sendByAfterInterval,
    timeFrames: [
      {
        startDayOfWeek: 1,
        startHour: 9,
        startMinutes: 0,

        endDayOfWeek: 5,
        endHour: 18,
        endMinutes: 0,

        sendEmailAfterInterval: 60,
        repeatFrequencyInterval: 0,
      },
    ],
    type: ErrorNotificationTypesEnum.lastTransactionTime,
  },

  // santanderDePosInvoice
  {
    isEnabled: false,
    integration: PaymentMethodsEnum.santanderDePosInvoice,
    repeatFrequencyInterval: 0,
    sendingMethod: SendingMethodEnum.sendByCronInterval,
    type: ErrorNotificationTypesEnum.paymentOptionCredentialsInvalid,
    updateInterval: CronUpdateIntervalEnum.every5minutes,
  },
  {
    isEnabled: false,
    integration: PaymentMethodsEnum.santanderDePosInvoice,
    sendingMethod: SendingMethodEnum.sendByAfterInterval,
    timeFrames: [
      {
        startDayOfWeek: 1,
        startHour: 9,
        startMinutes: 0,

        endDayOfWeek: 5,
        endHour: 18,
        endMinutes: 0,

        sendEmailAfterInterval: 60,
        repeatFrequencyInterval: 0,
      },
    ],
    type: ErrorNotificationTypesEnum.lastTransactionTime,
  },

  // santanderDeFactoring
  {
    isEnabled: false,
    integration: PaymentMethodsEnum.santanderDeFactoring,
    repeatFrequencyInterval: 0,
    sendingMethod: SendingMethodEnum.sendByCronInterval,
    type: ErrorNotificationTypesEnum.paymentOptionCredentialsInvalid,
    updateInterval: CronUpdateIntervalEnum.every5minutes,
  },
  {
    isEnabled: false,
    integration: PaymentMethodsEnum.santanderDeFactoring,
    sendingMethod: SendingMethodEnum.sendByAfterInterval,
    timeFrames: [
      {
        startDayOfWeek: 1,
        startHour: 9,
        startMinutes: 0,

        endDayOfWeek: 5,
        endHour: 18,
        endMinutes: 0,

        sendEmailAfterInterval: 60,
        repeatFrequencyInterval: 0,
      },
    ],
    type: ErrorNotificationTypesEnum.lastTransactionTime,
  },

  // santanderDePosFactoring
  {
    isEnabled: false,
    integration: PaymentMethodsEnum.santanderDePosFactoring,
    repeatFrequencyInterval: 0,
    sendingMethod: SendingMethodEnum.sendByCronInterval,
    type: ErrorNotificationTypesEnum.paymentOptionCredentialsInvalid,
    updateInterval: CronUpdateIntervalEnum.every5minutes,
  },
  {
    isEnabled: false,
    integration: PaymentMethodsEnum.santanderDePosFactoring,
    sendingMethod: SendingMethodEnum.sendByAfterInterval,
    timeFrames: [
      {
        startDayOfWeek: 1,
        startHour: 9,
        startMinutes: 0,

        endDayOfWeek: 5,
        endHour: 18,
        endMinutes: 0,

        sendEmailAfterInterval: 60,
        repeatFrequencyInterval: 0,
      },
    ],
    type: ErrorNotificationTypesEnum.lastTransactionTime,
  },

  // santanderDeCcpInstallment
  {
    isEnabled: false,
    integration: PaymentMethodsEnum.santanderDeCcpInstallment,
    repeatFrequencyInterval: 0,
    sendingMethod: SendingMethodEnum.sendByCronInterval,
    type: ErrorNotificationTypesEnum.paymentOptionCredentialsInvalid,
    updateInterval: CronUpdateIntervalEnum.every5minutes,
  },
  {
    isEnabled: false,
    integration: PaymentMethodsEnum.santanderDeCcpInstallment,
    sendingMethod: SendingMethodEnum.sendByAfterInterval,
    timeFrames: [
      {
        startDayOfWeek: 1,
        startHour: 9,
        startMinutes: 0,

        endDayOfWeek: 5,
        endHour: 18,
        endMinutes: 0,

        sendEmailAfterInterval: 60,
        repeatFrequencyInterval: 0,
      },
    ],
    type: ErrorNotificationTypesEnum.lastTransactionTime,
  },

  // santanderDePosInstallment
  {
    isEnabled: false,
    integration: PaymentMethodsEnum.santanderDePosInstallment,
    repeatFrequencyInterval: 0,
    sendingMethod: SendingMethodEnum.sendByCronInterval,
    type: ErrorNotificationTypesEnum.paymentOptionCredentialsInvalid,
    updateInterval: CronUpdateIntervalEnum.every5minutes,
  },
  {
    isEnabled: false,
    integration: PaymentMethodsEnum.santanderDePosInstallment,
    sendingMethod: SendingMethodEnum.sendByAfterInterval,
    timeFrames: [
      {
        startDayOfWeek: 1,
        startHour: 9,
        startMinutes: 0,

        endDayOfWeek: 5,
        endHour: 18,
        endMinutes: 0,

        sendEmailAfterInterval: 60,
        repeatFrequencyInterval: 0,
      },
    ],
    type: ErrorNotificationTypesEnum.lastTransactionTime,
  },

  // santanderNoInstallment
  {
    isEnabled: false,
    integration: PaymentMethodsEnum.santanderNoInstallment,
    repeatFrequencyInterval: 0,
    sendingMethod: SendingMethodEnum.sendByCronInterval,
    type: ErrorNotificationTypesEnum.paymentOptionCredentialsInvalid,
    updateInterval: CronUpdateIntervalEnum.every5minutes,
  },
  {
    isEnabled: false,
    integration: PaymentMethodsEnum.santanderNoInstallment,
    sendingMethod: SendingMethodEnum.sendByAfterInterval,
    timeFrames: [
      {
        startDayOfWeek: 1,
        startHour: 9,
        startMinutes: 0,

        endDayOfWeek: 5,
        endHour: 18,
        endMinutes: 0,

        sendEmailAfterInterval: 60,
        repeatFrequencyInterval: 0,
      },
    ],
    type: ErrorNotificationTypesEnum.lastTransactionTime,
  },

  // santanderNoPosInstallment
  {
    isEnabled: false,
    integration: PaymentMethodsEnum.santanderNoPosInstallment,
    repeatFrequencyInterval: 0,
    sendingMethod: SendingMethodEnum.sendByCronInterval,
    type: ErrorNotificationTypesEnum.paymentOptionCredentialsInvalid,
    updateInterval: CronUpdateIntervalEnum.every5minutes,
  },
  {
    isEnabled: false,
    integration: PaymentMethodsEnum.santanderNoPosInstallment,
    sendingMethod: SendingMethodEnum.sendByAfterInterval,
    timeFrames: [
      {
        startDayOfWeek: 1,
        startHour: 9,
        startMinutes: 0,

        endDayOfWeek: 5,
        endHour: 18,
        endMinutes: 0,

        sendEmailAfterInterval: 60,
        repeatFrequencyInterval: 0,
      },
    ],
    type: ErrorNotificationTypesEnum.lastTransactionTime,
  },

  // santanderNoInvoice
  {
    isEnabled: false,
    integration: PaymentMethodsEnum.santanderNoInvoice,
    repeatFrequencyInterval: 0,
    sendingMethod: SendingMethodEnum.sendByCronInterval,
    type: ErrorNotificationTypesEnum.paymentOptionCredentialsInvalid,
    updateInterval: CronUpdateIntervalEnum.every5minutes,
  },
  {
    isEnabled: false,
    integration: PaymentMethodsEnum.santanderNoInvoice,
    sendingMethod: SendingMethodEnum.sendByAfterInterval,
    timeFrames: [
      {
        startDayOfWeek: 1,
        startHour: 9,
        startMinutes: 0,

        endDayOfWeek: 5,
        endHour: 18,
        endMinutes: 0,

        sendEmailAfterInterval: 60,
        repeatFrequencyInterval: 0,
      },
    ],
    type: ErrorNotificationTypesEnum.lastTransactionTime,
  },

  // santanderNoPosInvoice
  {
    isEnabled: false,
    integration: PaymentMethodsEnum.santanderNoPosInvoice,
    repeatFrequencyInterval: 0,
    sendingMethod: SendingMethodEnum.sendByCronInterval,
    type: ErrorNotificationTypesEnum.paymentOptionCredentialsInvalid,
    updateInterval: CronUpdateIntervalEnum.every5minutes,
  },
  {
    isEnabled: false,
    integration: PaymentMethodsEnum.santanderNoPosInvoice,
    sendingMethod: SendingMethodEnum.sendByAfterInterval,
    timeFrames: [
      {
        startDayOfWeek: 1,
        startHour: 9,
        startMinutes: 0,

        endDayOfWeek: 5,
        endHour: 18,
        endMinutes: 0,

        sendEmailAfterInterval: 60,
        repeatFrequencyInterval: 0,
      },
    ],
    type: ErrorNotificationTypesEnum.lastTransactionTime,
  },

  // santanderDkInstallment
  {
    isEnabled: false,
    integration: PaymentMethodsEnum.santanderDkInstallment,
    repeatFrequencyInterval: 0,
    sendingMethod: SendingMethodEnum.sendByCronInterval,
    type: ErrorNotificationTypesEnum.paymentOptionCredentialsInvalid,
    updateInterval: CronUpdateIntervalEnum.every5minutes,
  },
  {
    isEnabled: false,
    integration: PaymentMethodsEnum.santanderDkInstallment,
    sendingMethod: SendingMethodEnum.sendByAfterInterval,
    timeFrames: [
      {
        startDayOfWeek: 1,
        startHour: 9,
        startMinutes: 0,

        endDayOfWeek: 5,
        endHour: 18,
        endMinutes: 0,

        sendEmailAfterInterval: 60,
        repeatFrequencyInterval: 0,
      },
    ],
    type: ErrorNotificationTypesEnum.lastTransactionTime,
  },

  // santanderDkPosInstallment
  {
    isEnabled: false,
    integration: PaymentMethodsEnum.santanderDkPosInstallment,
    repeatFrequencyInterval: 0,
    sendingMethod: SendingMethodEnum.sendByCronInterval,
    type: ErrorNotificationTypesEnum.paymentOptionCredentialsInvalid,
    updateInterval: CronUpdateIntervalEnum.every5minutes,
  },
  {
    isEnabled: false,
    integration: PaymentMethodsEnum.santanderDkPosInstallment,
    sendingMethod: SendingMethodEnum.sendByAfterInterval,
    timeFrames: [
      {
        startDayOfWeek: 1,
        startHour: 9,
        startMinutes: 0,

        endDayOfWeek: 5,
        endHour: 18,
        endMinutes: 0,

        sendEmailAfterInterval: 60,
        repeatFrequencyInterval: 0,
      },
    ],
    type: ErrorNotificationTypesEnum.lastTransactionTime,
  },

  // santanderSeInstallment
  {
    isEnabled: false,
    integration: PaymentMethodsEnum.santanderSeInstallment,
    repeatFrequencyInterval: 0,
    sendingMethod: SendingMethodEnum.sendByCronInterval,
    type: ErrorNotificationTypesEnum.paymentOptionCredentialsInvalid,
    updateInterval: CronUpdateIntervalEnum.every5minutes,
  },
  {
    isEnabled: false,
    integration: PaymentMethodsEnum.santanderSeInstallment,
    sendingMethod: SendingMethodEnum.sendByAfterInterval,
    timeFrames: [
      {
        startDayOfWeek: 1,
        startHour: 9,
        startMinutes: 0,

        endDayOfWeek: 5,
        endHour: 18,
        endMinutes: 0,

        sendEmailAfterInterval: 60,
        repeatFrequencyInterval: 0,
      },
    ],
    type: ErrorNotificationTypesEnum.lastTransactionTime,
  },

  // santanderSePosInstallment
  {
    isEnabled: false,
    integration: PaymentMethodsEnum.santanderSePosInstallment,
    repeatFrequencyInterval: 0,
    sendingMethod: SendingMethodEnum.sendByCronInterval,
    type: ErrorNotificationTypesEnum.paymentOptionCredentialsInvalid,
    updateInterval: CronUpdateIntervalEnum.every5minutes,
  },
  {
    isEnabled: false,
    integration: PaymentMethodsEnum.santanderSePosInstallment,
    sendingMethod: SendingMethodEnum.sendByAfterInterval,
    timeFrames: [
      {
        startDayOfWeek: 1,
        startHour: 9,
        startMinutes: 0,

        endDayOfWeek: 5,
        endHour: 18,
        endMinutes: 0,

        sendEmailAfterInterval: 60,
        repeatFrequencyInterval: 0,
      },
    ],
    type: ErrorNotificationTypesEnum.lastTransactionTime,
  },

  // santanderNlInstallment
  {
    isEnabled: false,
    integration: PaymentMethodsEnum.santanderNlInstallment,
    repeatFrequencyInterval: 0,
    sendingMethod: SendingMethodEnum.sendByCronInterval,
    type: ErrorNotificationTypesEnum.paymentOptionCredentialsInvalid,
    updateInterval: CronUpdateIntervalEnum.every5minutes,
  },
  {
    isEnabled: false,
    integration: PaymentMethodsEnum.santanderNlInstallment,
    sendingMethod: SendingMethodEnum.sendByAfterInterval,
    timeFrames: [
      {
        startDayOfWeek: 1,
        startHour: 9,
        startMinutes: 0,

        endDayOfWeek: 5,
        endHour: 18,
        endMinutes: 0,

        sendEmailAfterInterval: 60,
        repeatFrequencyInterval: 0,
      },
    ],
    type: ErrorNotificationTypesEnum.lastTransactionTime,
  },

  // santanderAtInstallment
  {
    isEnabled: false,
    integration: PaymentMethodsEnum.santanderAtInstallment,
    repeatFrequencyInterval: 0,
    sendingMethod: SendingMethodEnum.sendByCronInterval,
    type: ErrorNotificationTypesEnum.paymentOptionCredentialsInvalid,
    updateInterval: CronUpdateIntervalEnum.every5minutes,
  },
  {
    isEnabled: false,
    integration: PaymentMethodsEnum.santanderAtInstallment,
    sendingMethod: SendingMethodEnum.sendByAfterInterval,
    timeFrames: [
      {
        startDayOfWeek: 1,
        startHour: 9,
        startMinutes: 0,

        endDayOfWeek: 5,
        endHour: 18,
        endMinutes: 0,

        sendEmailAfterInterval: 60,
        repeatFrequencyInterval: 0,
      },
    ],
    type: ErrorNotificationTypesEnum.lastTransactionTime,
  },

  // cash
  {
    isEnabled: false,
    integration: PaymentMethodsEnum.cash,
    repeatFrequencyInterval: 0,
    sendingMethod: SendingMethodEnum.sendByCronInterval,
    type: ErrorNotificationTypesEnum.paymentOptionCredentialsInvalid,
    updateInterval: CronUpdateIntervalEnum.every5minutes,
  },
  {
    isEnabled: false,
    integration: PaymentMethodsEnum.cash,
    sendingMethod: SendingMethodEnum.sendByAfterInterval,
    timeFrames: [
      {
        startDayOfWeek: 1,
        startHour: 9,
        startMinutes: 0,

        endDayOfWeek: 5,
        endHour: 18,
        endMinutes: 0,

        sendEmailAfterInterval: 60,
        repeatFrequencyInterval: 0,
      },
    ],
    type: ErrorNotificationTypesEnum.lastTransactionTime,
  },

  // sofort
  {
    isEnabled: false,
    integration: PaymentMethodsEnum.sofort,
    repeatFrequencyInterval: 0,
    sendingMethod: SendingMethodEnum.sendByCronInterval,
    type: ErrorNotificationTypesEnum.paymentOptionCredentialsInvalid,
    updateInterval: CronUpdateIntervalEnum.every5minutes,
  },
  {
    isEnabled: false,
    integration: PaymentMethodsEnum.sofort,
    sendingMethod: SendingMethodEnum.sendByAfterInterval,
    timeFrames: [
      {
        startDayOfWeek: 1,
        startHour: 9,
        startMinutes: 0,

        endDayOfWeek: 5,
        endHour: 18,
        endMinutes: 0,

        sendEmailAfterInterval: 60,
        repeatFrequencyInterval: 0,
      },
    ],
    type: ErrorNotificationTypesEnum.lastTransactionTime,
  },

  // paypal
  {
    isEnabled: false,
    integration: PaymentMethodsEnum.paypal,
    repeatFrequencyInterval: 0,
    sendingMethod: SendingMethodEnum.sendByCronInterval,
    type: ErrorNotificationTypesEnum.paymentOptionCredentialsInvalid,
    updateInterval: CronUpdateIntervalEnum.every5minutes,
  },
  {
    isEnabled: false,
    integration: PaymentMethodsEnum.paypal,
    sendingMethod: SendingMethodEnum.sendByAfterInterval,
    timeFrames: [
      {
        startDayOfWeek: 1,
        startHour: 9,
        startMinutes: 0,

        endDayOfWeek: 5,
        endHour: 18,
        endMinutes: 0,

        sendEmailAfterInterval: 60,
        repeatFrequencyInterval: 0,
      },
    ],
    type: ErrorNotificationTypesEnum.lastTransactionTime,
  },

  // stripeCreditCard
  {
    isEnabled: false,
    integration: PaymentMethodsEnum.stripeCreditCard,
    repeatFrequencyInterval: 0,
    sendingMethod: SendingMethodEnum.sendByCronInterval,
    type: ErrorNotificationTypesEnum.paymentOptionCredentialsInvalid,
    updateInterval: CronUpdateIntervalEnum.every5minutes,
  },
  {
    isEnabled: false,
    integration: PaymentMethodsEnum.stripeCreditCard,
    sendingMethod: SendingMethodEnum.sendByAfterInterval,
    timeFrames: [
      {
        startDayOfWeek: 1,
        startHour: 9,
        startMinutes: 0,

        endDayOfWeek: 5,
        endHour: 18,
        endMinutes: 0,

        sendEmailAfterInterval: 60,
        repeatFrequencyInterval: 0,
      },
    ],
    type: ErrorNotificationTypesEnum.lastTransactionTime,
  },

  // stripeDirectDebit
  {
    isEnabled: false,
    integration: PaymentMethodsEnum.stripeDirectDebit,
    repeatFrequencyInterval: 0,
    sendingMethod: SendingMethodEnum.sendByCronInterval,
    type: ErrorNotificationTypesEnum.paymentOptionCredentialsInvalid,
    updateInterval: CronUpdateIntervalEnum.every5minutes,
  },
  {
    isEnabled: false,
    integration: PaymentMethodsEnum.stripeDirectDebit,
    sendingMethod: SendingMethodEnum.sendByAfterInterval,
    timeFrames: [
      {
        startDayOfWeek: 1,
        startHour: 9,
        startMinutes: 0,

        endDayOfWeek: 5,
        endHour: 18,
        endMinutes: 0,

        sendEmailAfterInterval: 60,
        repeatFrequencyInterval: 0,
      },
    ],
    type: ErrorNotificationTypesEnum.lastTransactionTime,
  },

  // swedbankInvoice
  {
    isEnabled: false,
    integration: PaymentMethodsEnum.swedbankInvoice,
    repeatFrequencyInterval: 0,
    sendingMethod: SendingMethodEnum.sendByCronInterval,
    type: ErrorNotificationTypesEnum.paymentOptionCredentialsInvalid,
    updateInterval: CronUpdateIntervalEnum.every5minutes,
  },
  {
    isEnabled: false,
    integration: PaymentMethodsEnum.swedbankInvoice,
    sendingMethod: SendingMethodEnum.sendByAfterInterval,
    timeFrames: [
      {
        startDayOfWeek: 1,
        startHour: 9,
        startMinutes: 0,

        endDayOfWeek: 5,
        endHour: 18,
        endMinutes: 0,

        sendEmailAfterInterval: 60,
        repeatFrequencyInterval: 0,
      },
    ],
    type: ErrorNotificationTypesEnum.lastTransactionTime,
  },

  // swedbankCreditCard
  {
    isEnabled: false,
    integration: PaymentMethodsEnum.swedbankCreditCard,
    repeatFrequencyInterval: 0,
    sendingMethod: SendingMethodEnum.sendByCronInterval,
    type: ErrorNotificationTypesEnum.paymentOptionCredentialsInvalid,
    updateInterval: CronUpdateIntervalEnum.every5minutes,
  },
  {
    isEnabled: false,
    integration: PaymentMethodsEnum.swedbankCreditCard,
    sendingMethod: SendingMethodEnum.sendByAfterInterval,
    timeFrames: [
      {
        startDayOfWeek: 1,
        startHour: 9,
        startMinutes: 0,

        endDayOfWeek: 5,
        endHour: 18,
        endMinutes: 0,

        sendEmailAfterInterval: 60,
        repeatFrequencyInterval: 0,
      },
    ],
    type: ErrorNotificationTypesEnum.lastTransactionTime,
  },

  // instantPayment
  {
    isEnabled: false,
    integration: PaymentMethodsEnum.instantPayment,
    repeatFrequencyInterval: 0,
    sendingMethod: SendingMethodEnum.sendByCronInterval,
    type: ErrorNotificationTypesEnum.paymentOptionCredentialsInvalid,
    updateInterval: CronUpdateIntervalEnum.every5minutes,
  },
  {
    isEnabled: false,
    integration: PaymentMethodsEnum.instantPayment,
    sendingMethod: SendingMethodEnum.sendByAfterInterval,
    timeFrames: [
      {
        startDayOfWeek: 1,
        startHour: 9,
        startMinutes: 0,

        endDayOfWeek: 5,
        endHour: 18,
        endMinutes: 0,

        sendEmailAfterInterval: 60,
        repeatFrequencyInterval: 0,
      },
    ],
    type: ErrorNotificationTypesEnum.lastTransactionTime,
  },

  // applePay
  {
    isEnabled: false,
    integration: PaymentMethodsEnum.applePay,
    repeatFrequencyInterval: 0,
    sendingMethod: SendingMethodEnum.sendByCronInterval,
    type: ErrorNotificationTypesEnum.paymentOptionCredentialsInvalid,
    updateInterval: CronUpdateIntervalEnum.every5minutes,
  },
  {
    isEnabled: false,
    integration: PaymentMethodsEnum.applePay,
    sendingMethod: SendingMethodEnum.sendByAfterInterval,
    timeFrames: [
      {
        startDayOfWeek: 1,
        startHour: 9,
        startMinutes: 0,

        endDayOfWeek: 5,
        endHour: 18,
        endMinutes: 0,

        sendEmailAfterInterval: 60,
        repeatFrequencyInterval: 0,
      },
    ],
    type: ErrorNotificationTypesEnum.lastTransactionTime,
  },

  // google_wallet
  {
    isEnabled: false,
    integration: PaymentMethodsEnum.googleWallet,
    repeatFrequencyInterval: 0,
    sendingMethod: SendingMethodEnum.sendByCronInterval,
    type: ErrorNotificationTypesEnum.paymentOptionCredentialsInvalid,
    updateInterval: CronUpdateIntervalEnum.every5minutes,
  },
  {
    isEnabled: false,
    integration: PaymentMethodsEnum.googleWallet,
    sendingMethod: SendingMethodEnum.sendByAfterInterval,
    timeFrames: [
      {
        startDayOfWeek: 1,
        startHour: 9,
        startMinutes: 0,

        endDayOfWeek: 5,
        endHour: 18,
        endMinutes: 0,

        sendEmailAfterInterval: 60,
        repeatFrequencyInterval: 0,
      },
    ],
    type: ErrorNotificationTypesEnum.lastTransactionTime,
  },

  // zinia_bnpl
  {
    isEnabled: false,
    integration: PaymentMethodsEnum.ziniaBnpl,
    repeatFrequencyInterval: 0,
    sendingMethod: SendingMethodEnum.sendByCronInterval,
    type: ErrorNotificationTypesEnum.paymentOptionCredentialsInvalid,
    updateInterval: CronUpdateIntervalEnum.every5minutes,
  },
  {
    isEnabled: false,
    integration: PaymentMethodsEnum.ziniaBnpl,
    sendingMethod: SendingMethodEnum.sendByAfterInterval,
    timeFrames: [
      {
        startDayOfWeek: 1,
        startHour: 9,
        startMinutes: 0,

        endDayOfWeek: 5,
        endHour: 18,
        endMinutes: 0,

        sendEmailAfterInterval: 60,
        repeatFrequencyInterval: 0,
      },
    ],
    type: ErrorNotificationTypesEnum.lastTransactionTime,
  },

  // zinia_pos
  {
    isEnabled: false,
    integration: PaymentMethodsEnum.ziniaPos,
    repeatFrequencyInterval: 0,
    sendingMethod: SendingMethodEnum.sendByCronInterval,
    type: ErrorNotificationTypesEnum.paymentOptionCredentialsInvalid,
    updateInterval: CronUpdateIntervalEnum.every5minutes,
  },
  {
    isEnabled: false,
    integration: PaymentMethodsEnum.ziniaPos,
    sendingMethod: SendingMethodEnum.sendByAfterInterval,
    timeFrames: [
      {
        startDayOfWeek: 1,
        startHour: 9,
        startMinutes: 0,

        endDayOfWeek: 5,
        endHour: 18,
        endMinutes: 0,

        sendEmailAfterInterval: 60,
        repeatFrequencyInterval: 0,
      },
    ],
    type: ErrorNotificationTypesEnum.lastTransactionTime,
  },

  // zinia_installment
  {
    isEnabled: false,
    integration: PaymentMethodsEnum.ziniaInstallment,
    repeatFrequencyInterval: 0,
    sendingMethod: SendingMethodEnum.sendByCronInterval,
    type: ErrorNotificationTypesEnum.paymentOptionCredentialsInvalid,
    updateInterval: CronUpdateIntervalEnum.every5minutes,
  },
  {
    isEnabled: false,
    integration: PaymentMethodsEnum.ziniaInstallment,
    sendingMethod: SendingMethodEnum.sendByAfterInterval,
    timeFrames: [
      {
        startDayOfWeek: 1,
        startHour: 9,
        startMinutes: 0,

        endDayOfWeek: 5,
        endHour: 18,
        endMinutes: 0,

        sendEmailAfterInterval: 60,
        repeatFrequencyInterval: 0,
      },
    ],
    type: ErrorNotificationTypesEnum.lastTransactionTime,
  },

  // zinia_slice_three
  {
    isEnabled: false,
    integration: PaymentMethodsEnum.ziniaSliceThree,
    repeatFrequencyInterval: 0,
    sendingMethod: SendingMethodEnum.sendByCronInterval,
    type: ErrorNotificationTypesEnum.paymentOptionCredentialsInvalid,
    updateInterval: CronUpdateIntervalEnum.every5minutes,
  },
  {
    isEnabled: false,
    integration: PaymentMethodsEnum.ziniaSliceThree,
    sendingMethod: SendingMethodEnum.sendByAfterInterval,
    timeFrames: [
      {
        startDayOfWeek: 1,
        startHour: 9,
        startMinutes: 0,

        endDayOfWeek: 5,
        endHour: 18,
        endMinutes: 0,

        sendEmailAfterInterval: 60,
        repeatFrequencyInterval: 0,
      },
    ],
    type: ErrorNotificationTypesEnum.lastTransactionTime,
  },

  // santander_installment_uk
  {
    isEnabled: false,
    integration: PaymentMethodsEnum.santanderUkInstallment,
    repeatFrequencyInterval: 0,
    sendingMethod: SendingMethodEnum.sendByCronInterval,
    type: ErrorNotificationTypesEnum.paymentOptionCredentialsInvalid,
    updateInterval: CronUpdateIntervalEnum.every5minutes,
  },
  {
    isEnabled: false,
    integration: PaymentMethodsEnum.santanderUkInstallment,
    sendingMethod: SendingMethodEnum.sendByAfterInterval,
    timeFrames: [
      {
        startDayOfWeek: 1,
        startHour: 9,
        startMinutes: 0,

        endDayOfWeek: 5,
        endHour: 18,
        endMinutes: 0,

        sendEmailAfterInterval: 60,
        repeatFrequencyInterval: 0,
      },
    ],
    type: ErrorNotificationTypesEnum.lastTransactionTime,
  },

  // santander_pos_installment_uk
  {
    isEnabled: false,
    integration: PaymentMethodsEnum.santanderUkPosInstallment,
    repeatFrequencyInterval: 0,
    sendingMethod: SendingMethodEnum.sendByCronInterval,
    type: ErrorNotificationTypesEnum.paymentOptionCredentialsInvalid,
    updateInterval: CronUpdateIntervalEnum.every5minutes,
  },
  {
    isEnabled: false,
    integration: PaymentMethodsEnum.santanderUkPosInstallment,
    sendingMethod: SendingMethodEnum.sendByAfterInterval,
    timeFrames: [
      {
        startDayOfWeek: 1,
        startHour: 9,
        startMinutes: 0,

        endDayOfWeek: 5,
        endHour: 18,
        endMinutes: 0,

        sendEmailAfterInterval: 60,
        repeatFrequencyInterval: 0,
      },
    ],
    type: ErrorNotificationTypesEnum.lastTransactionTime,
  },

  // santander_installment_fi
  {
    isEnabled: false,
    integration: PaymentMethodsEnum.santanderFiInstallment,
    repeatFrequencyInterval: 0,
    sendingMethod: SendingMethodEnum.sendByCronInterval,
    type: ErrorNotificationTypesEnum.paymentOptionCredentialsInvalid,
    updateInterval: CronUpdateIntervalEnum.every5minutes,
  },
  {
    isEnabled: false,
    integration: PaymentMethodsEnum.santanderFiInstallment,
    sendingMethod: SendingMethodEnum.sendByAfterInterval,
    timeFrames: [
      {
        startDayOfWeek: 1,
        startHour: 9,
        startMinutes: 0,

        endDayOfWeek: 5,
        endHour: 18,
        endMinutes: 0,

        sendEmailAfterInterval: 60,
        repeatFrequencyInterval: 0,
      },
    ],
    type: ErrorNotificationTypesEnum.lastTransactionTime,
  },

  // santander_pos_installment_fi
  {
    isEnabled: false,
    integration: PaymentMethodsEnum.santanderFiPosInstallment,
    repeatFrequencyInterval: 0,
    sendingMethod: SendingMethodEnum.sendByCronInterval,
    type: ErrorNotificationTypesEnum.paymentOptionCredentialsInvalid,
    updateInterval: CronUpdateIntervalEnum.every5minutes,
  },
  {
    isEnabled: false,
    integration: PaymentMethodsEnum.santanderFiPosInstallment,
    sendingMethod: SendingMethodEnum.sendByAfterInterval,
    timeFrames: [
      {
        startDayOfWeek: 1,
        startHour: 9,
        startMinutes: 0,

        endDayOfWeek: 5,
        endHour: 18,
        endMinutes: 0,

        sendEmailAfterInterval: 60,
        repeatFrequencyInterval: 0,
      },
    ],
    type: ErrorNotificationTypesEnum.lastTransactionTime,
  },

  // zinia_bnpl_de
  {
    isEnabled: false,
    integration: PaymentMethodsEnum.ziniaBnplDe,
    repeatFrequencyInterval: 0,
    sendingMethod: SendingMethodEnum.sendByCronInterval,
    type: ErrorNotificationTypesEnum.paymentOptionCredentialsInvalid,
    updateInterval: CronUpdateIntervalEnum.every5minutes,
  },
  {
    isEnabled: false,
    integration: PaymentMethodsEnum.ziniaBnplDe,
    sendingMethod: SendingMethodEnum.sendByAfterInterval,
    timeFrames: [
      {
        startDayOfWeek: 1,
        startHour: 9,
        startMinutes: 0,

        endDayOfWeek: 5,
        endHour: 18,
        endMinutes: 0,

        sendEmailAfterInterval: 60,
        repeatFrequencyInterval: 0,
      },
    ],
    type: ErrorNotificationTypesEnum.lastTransactionTime,
  },

  // zinia_pos_de
  {
    isEnabled: false,
    integration: PaymentMethodsEnum.ziniaPosDe,
    repeatFrequencyInterval: 0,
    sendingMethod: SendingMethodEnum.sendByCronInterval,
    type: ErrorNotificationTypesEnum.paymentOptionCredentialsInvalid,
    updateInterval: CronUpdateIntervalEnum.every5minutes,
  },
  {
    isEnabled: false,
    integration: PaymentMethodsEnum.ziniaPosDe,
    sendingMethod: SendingMethodEnum.sendByAfterInterval,
    timeFrames: [
      {
        startDayOfWeek: 1,
        startHour: 9,
        startMinutes: 0,

        endDayOfWeek: 5,
        endHour: 18,
        endMinutes: 0,

        sendEmailAfterInterval: 60,
        repeatFrequencyInterval: 0,
      },
    ],
    type: ErrorNotificationTypesEnum.lastTransactionTime,
  },

  // zinia_installment_de
  {
    isEnabled: false,
    integration: PaymentMethodsEnum.ziniaInstallmentDe,
    repeatFrequencyInterval: 0,
    sendingMethod: SendingMethodEnum.sendByCronInterval,
    type: ErrorNotificationTypesEnum.paymentOptionCredentialsInvalid,
    updateInterval: CronUpdateIntervalEnum.every5minutes,
  },
  {
    isEnabled: false,
    integration: PaymentMethodsEnum.ziniaInstallmentDe,
    sendingMethod: SendingMethodEnum.sendByAfterInterval,
    timeFrames: [
      {
        startDayOfWeek: 1,
        startHour: 9,
        startMinutes: 0,

        endDayOfWeek: 5,
        endHour: 18,
        endMinutes: 0,

        sendEmailAfterInterval: 60,
        repeatFrequencyInterval: 0,
      },
    ],
    type: ErrorNotificationTypesEnum.lastTransactionTime,
  },

  // zinia_slice_three_de
  {
    isEnabled: false,
    integration: PaymentMethodsEnum.ziniaSliceThreeDe,
    repeatFrequencyInterval: 0,
    sendingMethod: SendingMethodEnum.sendByCronInterval,
    type: ErrorNotificationTypesEnum.paymentOptionCredentialsInvalid,
    updateInterval: CronUpdateIntervalEnum.every5minutes,
  },
  {
    isEnabled: false,
    integration: PaymentMethodsEnum.ziniaSliceThreeDe,
    sendingMethod: SendingMethodEnum.sendByAfterInterval,
    timeFrames: [
      {
        startDayOfWeek: 1,
        startHour: 9,
        startMinutes: 0,

        endDayOfWeek: 5,
        endHour: 18,
        endMinutes: 0,

        sendEmailAfterInterval: 60,
        repeatFrequencyInterval: 0,
      },
    ],
    type: ErrorNotificationTypesEnum.lastTransactionTime,
  },

  // ivy
  {
    isEnabled: false,
    integration: PaymentMethodsEnum.ivy,
    repeatFrequencyInterval: 0,
    sendingMethod: SendingMethodEnum.sendByCronInterval,
    type: ErrorNotificationTypesEnum.paymentOptionCredentialsInvalid,
    updateInterval: CronUpdateIntervalEnum.every5minutes,
  },
  {
    isEnabled: false,
    integration: PaymentMethodsEnum.ivy,
    sendingMethod: SendingMethodEnum.sendByAfterInterval,
    timeFrames: [
      {
        startDayOfWeek: 1,
        startHour: 9,
        startMinutes: 0,

        endDayOfWeek: 5,
        endHour: 18,
        endMinutes: 0,

        sendEmailAfterInterval: 60,
        repeatFrequencyInterval: 0,
      },
    ],
    type: ErrorNotificationTypesEnum.lastTransactionTime,
  },

  // santander_installment_be
  {
    isEnabled: false,
    integration: PaymentMethodsEnum.santanderBeInstallment,
    repeatFrequencyInterval: 0,
    sendingMethod: SendingMethodEnum.sendByCronInterval,
    type: ErrorNotificationTypesEnum.paymentOptionCredentialsInvalid,
    updateInterval: CronUpdateIntervalEnum.every5minutes,
  },
  {
    isEnabled: false,
    integration: PaymentMethodsEnum.santanderBeInstallment,
    sendingMethod: SendingMethodEnum.sendByAfterInterval,
    timeFrames: [
      {
        startDayOfWeek: 1,
        startHour: 9,
        startMinutes: 0,

        endDayOfWeek: 5,
        endHour: 18,
        endMinutes: 0,

        sendEmailAfterInterval: 60,
        repeatFrequencyInterval: 0,
      },
    ],
    type: ErrorNotificationTypesEnum.lastTransactionTime,
  },
  
  // swish
  {
    isEnabled: false,
    integration: PaymentMethodsEnum.swish,
    repeatFrequencyInterval: 0,
    sendingMethod: SendingMethodEnum.sendByCronInterval,
    type: ErrorNotificationTypesEnum.paymentOptionCredentialsInvalid,
    updateInterval: CronUpdateIntervalEnum.every5minutes,
  },
  {
    isEnabled: false,
    integration: PaymentMethodsEnum.swish,
    sendingMethod: SendingMethodEnum.sendByAfterInterval,
    timeFrames: [
      {
        startDayOfWeek: 1,
        startHour: 9,
        startMinutes: 0,
        
        endDayOfWeek: 5,
        endHour: 18,
        endMinutes: 0,
        
        sendEmailAfterInterval: 60,
        repeatFrequencyInterval: 0,
      },
    ],
    type: ErrorNotificationTypesEnum.lastTransactionTime,
  },
  
  // vipps
  {
    isEnabled: false,
    integration: PaymentMethodsEnum.vipps,
    repeatFrequencyInterval: 0,
    sendingMethod: SendingMethodEnum.sendByCronInterval,
    type: ErrorNotificationTypesEnum.paymentOptionCredentialsInvalid,
    updateInterval: CronUpdateIntervalEnum.every5minutes,
  },
  {
    isEnabled: false,
    integration: PaymentMethodsEnum.vipps,
    sendingMethod: SendingMethodEnum.sendByAfterInterval,
    timeFrames: [
      {
        startDayOfWeek: 1,
        startHour: 9,
        startMinutes: 0,
        
        endDayOfWeek: 5,
        endHour: 18,
        endMinutes: 0,
        
        sendEmailAfterInterval: 60,
        repeatFrequencyInterval: 0,
      },
    ],
    type: ErrorNotificationTypesEnum.lastTransactionTime,
  },
  
  // mobilePay
  {
    isEnabled: false,
    integration: PaymentMethodsEnum.mobilePay,
    repeatFrequencyInterval: 0,
    sendingMethod: SendingMethodEnum.sendByCronInterval,
    type: ErrorNotificationTypesEnum.paymentOptionCredentialsInvalid,
    updateInterval: CronUpdateIntervalEnum.every5minutes,
  },
  {
    isEnabled: false,
    integration: PaymentMethodsEnum.mobilePay,
    sendingMethod: SendingMethodEnum.sendByAfterInterval,
    timeFrames: [
      {
        startDayOfWeek: 1,
        startHour: 9,
        startMinutes: 0,
        
        endDayOfWeek: 5,
        endHour: 18,
        endMinutes: 0,
        
        sendEmailAfterInterval: 60,
        repeatFrequencyInterval: 0,
      },
    ],
    type: ErrorNotificationTypesEnum.lastTransactionTime,
  },
  
  // trustly
  {
    isEnabled: false,
    integration: PaymentMethodsEnum.trustly,
    repeatFrequencyInterval: 0,
    sendingMethod: SendingMethodEnum.sendByCronInterval,
    type: ErrorNotificationTypesEnum.paymentOptionCredentialsInvalid,
    updateInterval: CronUpdateIntervalEnum.every5minutes,
  },
  {
    isEnabled: false,
    integration: PaymentMethodsEnum.trustly,
    sendingMethod: SendingMethodEnum.sendByAfterInterval,
    timeFrames: [
      {
        startDayOfWeek: 1,
        startHour: 9,
        startMinutes: 0,
        
        endDayOfWeek: 5,
        endHour: 18,
        endMinutes: 0,
        
        sendEmailAfterInterval: 60,
        repeatFrequencyInterval: 0,
      },
    ],
    type: ErrorNotificationTypesEnum.lastTransactionTime,
  },
  
  // ideal
  {
    isEnabled: false,
    integration: PaymentMethodsEnum.ideal,
    repeatFrequencyInterval: 0,
    sendingMethod: SendingMethodEnum.sendByCronInterval,
    type: ErrorNotificationTypesEnum.paymentOptionCredentialsInvalid,
    updateInterval: CronUpdateIntervalEnum.every5minutes,
  },
  {
    isEnabled: false,
    integration: PaymentMethodsEnum.ideal,
    sendingMethod: SendingMethodEnum.sendByAfterInterval,
    timeFrames: [
      {
        startDayOfWeek: 1,
        startHour: 9,
        startMinutes: 0,
        
        endDayOfWeek: 5,
        endHour: 18,
        endMinutes: 0,
        
        sendEmailAfterInterval: 60,
        repeatFrequencyInterval: 0,
      },
    ],
    type: ErrorNotificationTypesEnum.lastTransactionTime,
  },
  
  // allianz
  {
    isEnabled: false,
    integration: PaymentMethodsEnum.allianz,
    repeatFrequencyInterval: 0,
    sendingMethod: SendingMethodEnum.sendByCronInterval,
    type: ErrorNotificationTypesEnum.paymentOptionCredentialsInvalid,
    updateInterval: CronUpdateIntervalEnum.every5minutes,
  },
  {
    isEnabled: false,
    integration: PaymentMethodsEnum.allianz,
    sendingMethod: SendingMethodEnum.sendByAfterInterval,
    timeFrames: [
      {
        startDayOfWeek: 1,
        startHour: 9,
        startMinutes: 0,
        
        endDayOfWeek: 5,
        endHour: 18,
        endMinutes: 0,
        
        sendEmailAfterInterval: 60,
        repeatFrequencyInterval: 0,
      },
    ],
    type: ErrorNotificationTypesEnum.lastTransactionTime,
  },

  // hsbc
  {
    isEnabled: false,
    integration: PaymentMethodsEnum.hsbc,
    repeatFrequencyInterval: 0,
    sendingMethod: SendingMethodEnum.sendByCronInterval,
    type: ErrorNotificationTypesEnum.paymentOptionCredentialsInvalid,
    updateInterval: CronUpdateIntervalEnum.every5minutes,
  },
  {
    isEnabled: false,
    integration: PaymentMethodsEnum.hsbc,
    sendingMethod: SendingMethodEnum.sendByAfterInterval,
    timeFrames: [
      {
        startDayOfWeek: 1,
        startHour: 9,
        startMinutes: 0,

        endDayOfWeek: 5,
        endHour: 18,
        endMinutes: 0,

        sendEmailAfterInterval: 60,
        repeatFrequencyInterval: 0,
      },
    ],
    type: ErrorNotificationTypesEnum.lastTransactionTime,
  },

  // santander_instant_at
  {
    isEnabled: false,
    integration: PaymentMethodsEnum.santanderInstantAt,
    repeatFrequencyInterval: 0,
    sendingMethod: SendingMethodEnum.sendByCronInterval,
    type: ErrorNotificationTypesEnum.paymentOptionCredentialsInvalid,
    updateInterval: CronUpdateIntervalEnum.every5minutes,
  },
  {
    isEnabled: false,
    integration: PaymentMethodsEnum.santanderInstantAt,
    sendingMethod: SendingMethodEnum.sendByAfterInterval,
    timeFrames: [
      {
        startDayOfWeek: 1,
        startHour: 9,
        startMinutes: 0,

        endDayOfWeek: 5,
        endHour: 18,
        endMinutes: 0,

        sendEmailAfterInterval: 60,
        repeatFrequencyInterval: 0,
      },
    ],
    type: ErrorNotificationTypesEnum.lastTransactionTime,
  },
];
