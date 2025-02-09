import { ReportCountriesEnum } from './report-countries.enum';

export enum PaymentMethodsEnum {
  santanderDeInstallment = 'santander_installment',
  santanderDeInvoice = 'santander_invoice_de',
  santanderDePosInvoice = 'santander_pos_invoice_de',
  santanderDeFactoring = 'santander_factoring_de',
  santanderDePosFactoring = 'santander_pos_factoring_de',
  santanderDeCcpInstallment = 'santander_ccp_installment',
  santanderDePosInstallment = 'santander_pos_installment',
  santanderNoInstallment = 'santander_installment_no',
  santanderNoPosInstallment = 'santander_pos_installment_no',
  santanderNoInvoice = 'santander_invoice_no',
  santanderNoPosInvoice = 'santander_pos_invoice_no',
  santanderDkInstallment = 'santander_installment_dk',
  santanderDkPosInstallment = 'santander_pos_installment_dk',
  santanderSeInstallment = 'santander_installment_se',
  santanderSePosInstallment = 'santander_pos_installment_se',
  santanderNlInstallment = 'santander_installment_nl',
  santanderBeInstallment = 'santander_installment_be',
  santanderAtInstallment = 'santander_installment_at',
  cash = 'cash',
  ivy = 'ivy',
  sofort = 'sofort',
  paypal = 'paypal',
  stripeCreditCard = 'stripe',
  stripeDirectDebit = 'stripe_directdebit',
  swedbankInvoice= 'swedbank_invoice',
  swedbankCreditCard = 'swedbank_creditcard',
  instantPayment = 'instant_payment',
  applePay = 'apple_pay',
  googlePay = 'google_pay',
  santanderUKInstallment = 'santander_installment_uk',
  santanderUKPosInstallment = 'santander_pos_installment_uk',
  santanderFIInstallment = 'santander_installment_fi',
  santanderFIPosInstallment = 'santander_pos_installment_fi',
  ziniaBnpl = 'zinia_bnpl',
  ziniaPos = 'zinia_pos',
  ziniaSliceThree = 'zinia_slice_three',
  ziniaInstallment = 'zinia_installment',
  ziniaBnplDe = 'zinia_bnpl_de',
  ziniaPosDe = 'zinia_pos_de',
  ziniaSliceThreeDe = 'zinia_slice_three_de',
  ziniaInstallmentDe = 'zinia_installment_de',
  trustly = 'trustly',
  vipps = 'vipps',
  swish = 'swish',
  mobilePay = 'mobile_pay'
}

export const CountryPaymentMethods: Map<ReportCountriesEnum, PaymentMethodsEnum[]> =
  new Map<ReportCountriesEnum, PaymentMethodsEnum[]>([
    [
      ReportCountriesEnum.germany,
      [
        PaymentMethodsEnum.santanderDeInstallment,
        PaymentMethodsEnum.santanderDeInvoice,
        PaymentMethodsEnum.santanderDePosInvoice,
        PaymentMethodsEnum.santanderDeFactoring,
        PaymentMethodsEnum.santanderDePosFactoring,
        PaymentMethodsEnum.santanderDeCcpInstallment,
        PaymentMethodsEnum.santanderDePosInstallment,
        PaymentMethodsEnum.instantPayment,
        PaymentMethodsEnum.ziniaBnplDe,
        PaymentMethodsEnum.ziniaPosDe,
        PaymentMethodsEnum.ziniaSliceThreeDe,
        PaymentMethodsEnum.ziniaInstallmentDe,
      ],
    ],
    [
      ReportCountriesEnum.norway,
      [
        PaymentMethodsEnum.santanderNoInstallment,
        PaymentMethodsEnum.santanderNoPosInstallment,
        PaymentMethodsEnum.santanderNoInvoice,
        PaymentMethodsEnum.santanderNoPosInvoice,
      ],
    ],
    [
      ReportCountriesEnum.denmark,
      [
        PaymentMethodsEnum.santanderDkInstallment,
        PaymentMethodsEnum.santanderDkPosInstallment,
      ],
    ],
    [
      ReportCountriesEnum.sweden,
      [
        PaymentMethodsEnum.santanderSeInstallment,
        PaymentMethodsEnum.santanderSePosInstallment,
      ],
    ],
    [
      ReportCountriesEnum.netherlands,
      [
        PaymentMethodsEnum.santanderNlInstallment,
        PaymentMethodsEnum.ziniaBnpl,
        PaymentMethodsEnum.ziniaPos,
        PaymentMethodsEnum.ziniaSliceThree,
        PaymentMethodsEnum.ziniaInstallment,
      ],
    ],
    [
      ReportCountriesEnum.austria,
      [
        PaymentMethodsEnum.santanderAtInstallment,
      ],
    ],
    [
      ReportCountriesEnum.unitedKingdom,
      [
        PaymentMethodsEnum.santanderUKInstallment,
        PaymentMethodsEnum.santanderUKPosInstallment,
      ],
    ],
    [
      ReportCountriesEnum.finland,
      [
        PaymentMethodsEnum.santanderFIInstallment,
        PaymentMethodsEnum.santanderFIPosInstallment,
      ],
    ],
    [
      ReportCountriesEnum.belgium,
      [
        PaymentMethodsEnum.santanderBeInstallment,
      ],
    ],
    [
      ReportCountriesEnum.others,
      [
        PaymentMethodsEnum.ivy,
        PaymentMethodsEnum.cash,
        PaymentMethodsEnum.sofort,
        PaymentMethodsEnum.paypal,
        PaymentMethodsEnum.stripeCreditCard,
        PaymentMethodsEnum.stripeDirectDebit,
        PaymentMethodsEnum.swedbankInvoice,
        PaymentMethodsEnum.swedbankCreditCard,
        PaymentMethodsEnum.applePay,
        PaymentMethodsEnum.googlePay,
      ],
    ],
  ]);

export const PaymentMethodsAllowedInterval: Map<PaymentMethodsEnum, number> =
  new Map<PaymentMethodsEnum, number>([
    [
      PaymentMethodsEnum.ziniaBnplDe,
      5 * 60,
    ],
    [
      PaymentMethodsEnum.ziniaInstallmentDe,
      15 * 60,
    ],
    [
      PaymentMethodsEnum.santanderDeInstallment,
      10 * 60,
    ],
    [
      PaymentMethodsEnum.santanderDePosInstallment,
      15 * 60,
    ],
    [
      PaymentMethodsEnum.ivy,
      30 * 60,
    ],
    [
      PaymentMethodsEnum.instantPayment,
      4 * 60 * 60,
    ],
    [
      PaymentMethodsEnum.santanderDkInstallment,
      30 * 60,
    ],
    [
      PaymentMethodsEnum.santanderAtInstallment,
      1 * 60 * 60,
    ],
    [
      PaymentMethodsEnum.santanderNoInstallment,
      1 * 60 * 60,
    ],
    [
      PaymentMethodsEnum.santanderNoInvoice,
      1 * 60 * 60,
    ],
    [
      PaymentMethodsEnum.santanderSeInstallment,
      4 * 60 * 60,
    ],
    [
      PaymentMethodsEnum.santanderFIInstallment,
      24 * 60 * 60,
    ],
    [
      PaymentMethodsEnum.santanderBeInstallment,
      24 * 60 * 60,
    ],
    [
      PaymentMethodsEnum.paypal,
      30 * 60,
    ],
    [
      PaymentMethodsEnum.stripeCreditCard,
      30 * 60,
    ],
    [
      PaymentMethodsEnum.stripeDirectDebit,
      24 * 60 * 60,
    ],
    [
      PaymentMethodsEnum.ziniaBnpl,
      24 * 60 * 60,
    ],
    [
      PaymentMethodsEnum.ziniaPos,
      24 * 60 * 60,
    ],
    [
      PaymentMethodsEnum.ziniaSliceThree,
      24 * 60 * 60,
    ],
    [
      PaymentMethodsEnum.ziniaPosDe,
      24 * 60 * 60,
    ],
    [
      PaymentMethodsEnum.ziniaSliceThreeDe,
      24 * 60 * 60,
    ],
    [
      PaymentMethodsEnum.applePay,
      24 * 60 * 60,
    ],
    [
      PaymentMethodsEnum.googlePay,
      24 * 60 * 60,
    ],
    [
      PaymentMethodsEnum.swedbankInvoice,
      24 * 60 * 60,
    ],
    [
      PaymentMethodsEnum.swedbankCreditCard,
      24 * 60 * 60,
    ],
     [
      PaymentMethodsEnum.trustly,
      24 * 60 * 60,
    ],
    [
      PaymentMethodsEnum.swish,
      24 * 60 * 60,
    ],
    [
      PaymentMethodsEnum.vipps,
      24 * 60 * 60,
    ],
    [
      PaymentMethodsEnum.mobilePay,
      24 * 60 * 60,
    ],
  ]);

export const PaymentMethodsNames: Map<PaymentMethodsEnum, string> =
  new Map<PaymentMethodsEnum, string>([
    [
      PaymentMethodsEnum.instantPayment,
      'Instant payment',
    ],
    [
      PaymentMethodsEnum.ivy,
      'Ivy',
    ],
    [
      PaymentMethodsEnum.paypal,
      'PayPal',
    ],
    [
      PaymentMethodsEnum.sofort,
      'Sofort',
    ],
    [
      PaymentMethodsEnum.stripeDirectDebit,
      'Stripe DD',
    ],
    [
      PaymentMethodsEnum.stripeCreditCard,
      'Stripe CC',
    ],
    [
      PaymentMethodsEnum.santanderSeInstallment,
      'Santander SE',
    ],
    [
      PaymentMethodsEnum.santanderDkInstallment,
      'Santander DK',
    ],
    [
      PaymentMethodsEnum.santanderNoInvoice,
      'NO Invoice',
    ],
    [
      PaymentMethodsEnum.santanderNoInstallment,
      'Santander NO',
    ],
    [
      PaymentMethodsEnum.santanderDeFactoring,
      'DE Factoring',
    ],
    [
      PaymentMethodsEnum.santanderDeInvoice,
      'DE Invoice',
    ],
    [
      PaymentMethodsEnum.santanderDeCcpInstallment,
      'Santander DE CCP',
    ],
    [
      PaymentMethodsEnum.cash,
      'Wire Transfer',
    ],
    [
      PaymentMethodsEnum.santanderSePosInstallment,
      'Santander SE POS',
    ],
    [
      PaymentMethodsEnum.santanderDePosInstallment,
      'Santander DE POS',
    ],
    [
      PaymentMethodsEnum.santanderDePosFactoring,
      'DE Factoring POS',
    ],
    [
      PaymentMethodsEnum.santanderDePosInvoice,
      'DE Invoice POS',
    ],
    [
      PaymentMethodsEnum.santanderDeInstallment,
      'Santander DE',
    ],
    [
      PaymentMethodsEnum.swedbankCreditCard,
      'Swedbank CC',
    ],
    [
      PaymentMethodsEnum.swedbankInvoice,
      'Swedbank Invoice',
    ],
    [
      PaymentMethodsEnum.santanderDkPosInstallment,
      'Santander DK POS',
    ],
    [
      PaymentMethodsEnum.santanderNoPosInvoice,
      'NO POS Invoice',
    ],
    [
      PaymentMethodsEnum.santanderNoPosInstallment,
      'Santander NO POS',
    ],
    [
      PaymentMethodsEnum.santanderAtInstallment,
      'Santander AT',
    ],
    [
      PaymentMethodsEnum.santanderNlInstallment,
      'Santander NL',
    ],
    [
      PaymentMethodsEnum.santanderBeInstallment,
      'Santander BE',
    ],
    [
      PaymentMethodsEnum.santanderUKInstallment,
      'Santander UK',
    ],
    [
      PaymentMethodsEnum.santanderUKPosInstallment,
      'Santander UK POS',
    ],
    [
      PaymentMethodsEnum.santanderFIInstallment,
      'Santander FI',
    ],
    [
      PaymentMethodsEnum.santanderFIPosInstallment,
      'Santander FI POS',
    ],
    [
      PaymentMethodsEnum.ziniaBnpl,
      'Zinia NL BNPL',
    ],
    [
      PaymentMethodsEnum.ziniaInstallment,
      'Zinia NL Installment',
    ],
    [
      PaymentMethodsEnum.ziniaPos,
      'Zinia NL POS',
    ],
    [
      PaymentMethodsEnum.ziniaSliceThree,
      'Zinia NL Slice in Three',
    ],
    [
      PaymentMethodsEnum.ziniaBnplDe,
      'Zinia DE BNPL',
    ],
    [
      PaymentMethodsEnum.ziniaInstallmentDe,
      'Zinia DE Installment',
    ],
    [
      PaymentMethodsEnum.ziniaPosDe,
      'Zinia DE POS',
    ],
    [
      PaymentMethodsEnum.ziniaSliceThreeDe,
      'Zinia DL Slice in Three',
    ],
    [
      PaymentMethodsEnum.applePay,
      'Apple Pay',
    ],
    [
      PaymentMethodsEnum.googlePay,
      'Google Pay',
    ],
    [
      PaymentMethodsEnum.trustly,
      'Trustly',
    ],
    [
      PaymentMethodsEnum.swish,
      'Swish',
    ],
    [
      PaymentMethodsEnum.vipps,
      'Vipps',
    ],
    [
      PaymentMethodsEnum.mobilePay,
      'Mobile Pay',
    ],
  ]);

export const AllowedPaymentMethodsForCharts: PaymentMethodsEnum[] = [
  PaymentMethodsEnum.santanderNlInstallment,
  PaymentMethodsEnum.santanderBeInstallment,
  PaymentMethodsEnum.santanderAtInstallment,
  PaymentMethodsEnum.santanderDePosFactoring,
  PaymentMethodsEnum.santanderDeFactoring,
  PaymentMethodsEnum.santanderDeInvoice,
  PaymentMethodsEnum.santanderDePosInvoice,
  PaymentMethodsEnum.santanderDePosInstallment,
  PaymentMethodsEnum.santanderDeInstallment,
  PaymentMethodsEnum.instantPayment,
  PaymentMethodsEnum.santanderSeInstallment,
  PaymentMethodsEnum.santanderDkInstallment,
  PaymentMethodsEnum.santanderNoInvoice,
  PaymentMethodsEnum.santanderNoInstallment,
  PaymentMethodsEnum.santanderFIInstallment,
  PaymentMethodsEnum.santanderFIPosInstallment,
  PaymentMethodsEnum.santanderUKInstallment,
  PaymentMethodsEnum.santanderUKPosInstallment,
  PaymentMethodsEnum.ziniaBnpl,
  PaymentMethodsEnum.ziniaInstallment,
  PaymentMethodsEnum.ziniaPos,
  PaymentMethodsEnum.ziniaSliceThree,
  PaymentMethodsEnum.ziniaBnplDe,
  PaymentMethodsEnum.ziniaInstallmentDe,
  PaymentMethodsEnum.ziniaPosDe,
  PaymentMethodsEnum.ziniaSliceThreeDe,
];
