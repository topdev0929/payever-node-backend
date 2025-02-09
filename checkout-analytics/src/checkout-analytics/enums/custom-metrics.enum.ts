import { PaymentMethodsEnum } from './payment-methods.enum';

export enum CustomMetricsEnum {
  RateSelected = 'rate_selected',
  RateStepPassed = 'rate_step_passed',
  DKMitIdPassed = 'mitid_step_passed',
  DKSkatPassed = 'skat_step_passed',
  DKBankConsentPassed = 'bank_consent_step_passed',
  SeBankIdPassed = 'bank_id_step_passed',
  CustomerForm1Passed = 'customer_form1_step_passed',
  CustomerForm2Passed = 'customer_form2_step_passed',
  ContractSigningSuccess = 'contract_signing_success',
  ContractSigningFailed = 'contract_signing_failed',
  ContractSigningCancelled = 'contract_signing_cancelled',
  NorwayScoreFormSubmitted = 'norway_score_form_submitted',
  OtpCodeInitiated = 'otp_code_initiated',
  OtpCodeVerified = 'otp_code_verified',
  MarketingConsentGiven = 'marketing_consent_given',
  InsuranceConsentGiven = 'insurance_consent_given',
  GeneralConsentGiven = 'general_consent_given',
  AnalyzeDocumentPassed = 'analyze_document_passed',
}

export enum ConversionReportFieldsEnum {
  FlowCount = 'flowCount',
  NewPaymentCount = 'newPaymentCount',
  NewPaymentPercent = 'newPaymentPercent',
  SuccessPaymentCount = 'successPaymentCount',
  SuccessPaymentPercent = 'successPaymentPercent',
  SuccessExcludeFailedPaymentCount = 'successExcludeFailedPaymentCount',
  SuccessExcludeFailedPaymentPercent = 'successExcludeFailedPaymentPercent',
  PaidPaymentCount = 'paidPaymentCount',
  PaidPaymentPercent = 'paidPaymentPercent',
  DeclinedPaymentCount = 'declinedPaymentCount',
  DeclinedPaymentPercent = 'declinedPaymentPercent',
  FailedPaymentCount = 'failedPaymentCount',
  FailedPaymentPercent = 'failedPaymentPercent',
  RateSelectedCount = 'rateSelectedCount',
  RateSelectedPercent = 'rateSelectedPercent',
  RateStepPassedCount = 'rateStepPassedCount',
  RateStepPassedPercent = 'rateStepPassedPercent',
  MitIdStepPassedCount = 'mitIdStepPassedCount',
  MitIdStepPassedPercent = 'mitIdStepPassedPercent',
  SkatStepPassedCount = 'skatStepPassedCount',
  SkatStepPassedPercent = 'skatStepPassedPercent',
  BankConsentStepPassedCount = 'bankConsentStepPassedCount',
  BankConsentStepPassedPercent = 'bankConsentStepPassedPercent',
  BankIdStepPassedCount = 'bankIdStepPassedCount',
  BankIdStepPassedPercent = 'bankIdStepPassedPercent',
  CustomerForm1PassedCount = 'customerForm1StepPassedCount',
  CustomerForm1PassedPercent = 'customerForm1StepPassedPercent',
  CustomerForm2PassedCount = 'customerForm2StepPassedCount',
  CustomerForm2PassedPercent = 'customerForm2StepPassedPercent',
  ContractSigningSuccessCount = 'contractSigningSuccessCount',
  ContractSigningSuccessPercent = 'contractSigningSuccessPercent',
  ContractSigningFailedCount = 'contractSigningFailedCount',
  ContractSigningFailedPercent = 'contractSigningFailedPercent',
  ContractSigningCancelledCount = 'contractSigningCancelledCount',
  ContractSigningCancelledPercent = 'contractSigningCancelledPercent',
  NorwayScoreFormSubmittedCount = 'norwayScoreFormSubmittedCount',
  NorwayScoreFormSubmittedPercent = 'norwayScoreFormSubmittedPercent',
  OtpCodeInitiatedCount = 'otpCodeInitiatedCount',
  OtpCodeInitiatedPercent = 'otpCodeInitiatedPercent',
  OtpCodeVerifiedCount = 'otpCodeVerifiedCount',
  OtpCodeVerifiedPercent = 'otpCodeVerifiedPercent',
  MarketingConsentGivenCount = 'marketingConsentGivenCount',
  MarketingConsentGivenPercent = 'marketingConsentGivenPercent',
  InsuranceConsentGivenCount = 'insuranceConsentGivenCount',
  InsuranceConsentGivenPercent = 'insuranceConsentGivenPercent',
  GeneralConsentGivenCount = 'generalConsentGivenCount',
  GeneralConsentGivenPercent = 'generalConsentGivenPercent',
  AnalyzeDocumentPassedCount = 'analyzeDocumentPassedCount',
  AnalyzeDocumentPassedPercent = 'analyzeDocumentPassedPercent',
}

export enum ConversionFormReportFieldsEnum {
  AllForms = 'allForms',
  CompletedForms = 'completedForms',
  InCompletedForms = 'incompletedForms',
}

export const CustomMetricsFieldsMapping: Map<ConversionReportFieldsEnum, CustomMetricsEnum> =
  new Map<ConversionReportFieldsEnum, CustomMetricsEnum>([
    [
      ConversionReportFieldsEnum.RateSelectedCount,
      CustomMetricsEnum.RateSelected,
    ],
    [
      ConversionReportFieldsEnum.RateStepPassedCount,
      CustomMetricsEnum.RateStepPassed,
    ],
    [
      ConversionReportFieldsEnum.MitIdStepPassedCount,
      CustomMetricsEnum.DKMitIdPassed,
    ],
    [
      ConversionReportFieldsEnum.SkatStepPassedCount,
      CustomMetricsEnum.DKSkatPassed,
    ],
    [
      ConversionReportFieldsEnum.BankConsentStepPassedCount,
      CustomMetricsEnum.DKBankConsentPassed,
    ],
    [
      ConversionReportFieldsEnum.BankIdStepPassedCount,
      CustomMetricsEnum.SeBankIdPassed,
    ],
    [
      ConversionReportFieldsEnum.CustomerForm1PassedCount,
      CustomMetricsEnum.CustomerForm1Passed,
    ],
    [
      ConversionReportFieldsEnum.CustomerForm2PassedCount,
      CustomMetricsEnum.CustomerForm2Passed,
    ],
    [
      ConversionReportFieldsEnum.ContractSigningSuccessCount,
      CustomMetricsEnum.ContractSigningSuccess,
    ],
    [
      ConversionReportFieldsEnum.ContractSigningFailedCount,
      CustomMetricsEnum.ContractSigningFailed,
    ],
    [
      ConversionReportFieldsEnum.ContractSigningCancelledCount,
      CustomMetricsEnum.ContractSigningCancelled,
    ],
    [
      ConversionReportFieldsEnum.NorwayScoreFormSubmittedCount,
      CustomMetricsEnum.NorwayScoreFormSubmitted,
    ],
    [
      ConversionReportFieldsEnum.OtpCodeInitiatedCount,
      CustomMetricsEnum.OtpCodeInitiated,
    ],
    [
      ConversionReportFieldsEnum.OtpCodeVerifiedCount,
      CustomMetricsEnum.OtpCodeVerified,
    ],
    [
      ConversionReportFieldsEnum.MarketingConsentGivenCount,
      CustomMetricsEnum.MarketingConsentGiven,
    ],
    [
      ConversionReportFieldsEnum.InsuranceConsentGivenCount,
      CustomMetricsEnum.InsuranceConsentGiven,
    ],
    [
      ConversionReportFieldsEnum.GeneralConsentGivenCount,
      CustomMetricsEnum.GeneralConsentGiven,
    ],
    [
      ConversionReportFieldsEnum.AnalyzeDocumentPassedCount,
      CustomMetricsEnum.AnalyzeDocumentPassed,
    ],
  ]);

export const ConversionPercentageFieldsMapping: Map<ConversionReportFieldsEnum, ConversionReportFieldsEnum> =
  new Map<ConversionReportFieldsEnum, ConversionReportFieldsEnum>([
    [
      ConversionReportFieldsEnum.NewPaymentCount,
      ConversionReportFieldsEnum.NewPaymentPercent,
    ],
    [
      ConversionReportFieldsEnum.SuccessPaymentCount,
      ConversionReportFieldsEnum.SuccessPaymentPercent,
    ],
    [
      ConversionReportFieldsEnum.SuccessExcludeFailedPaymentCount,
      ConversionReportFieldsEnum.SuccessExcludeFailedPaymentPercent,
    ],
    [
      ConversionReportFieldsEnum.PaidPaymentCount,
      ConversionReportFieldsEnum.PaidPaymentPercent,
    ],
    [
      ConversionReportFieldsEnum.DeclinedPaymentCount,
      ConversionReportFieldsEnum.DeclinedPaymentPercent,
    ],
    [
      ConversionReportFieldsEnum.FailedPaymentCount,
      ConversionReportFieldsEnum.FailedPaymentPercent,
    ],
    [
      ConversionReportFieldsEnum.RateSelectedCount,
      ConversionReportFieldsEnum.RateSelectedPercent,
    ],
    [
      ConversionReportFieldsEnum.RateStepPassedCount,
      ConversionReportFieldsEnum.RateStepPassedPercent,
    ],
    [
      ConversionReportFieldsEnum.MitIdStepPassedCount,
      ConversionReportFieldsEnum.MitIdStepPassedPercent,
    ],
    [
      ConversionReportFieldsEnum.SkatStepPassedCount,
      ConversionReportFieldsEnum.SkatStepPassedPercent,
    ],
    [
      ConversionReportFieldsEnum.BankConsentStepPassedCount,
      ConversionReportFieldsEnum.BankConsentStepPassedPercent,
    ],
    [
      ConversionReportFieldsEnum.BankIdStepPassedCount,
      ConversionReportFieldsEnum.BankIdStepPassedPercent,
    ],
    [
      ConversionReportFieldsEnum.CustomerForm1PassedCount,
      ConversionReportFieldsEnum.CustomerForm1PassedPercent,
    ],
    [
      ConversionReportFieldsEnum.CustomerForm2PassedCount,
      ConversionReportFieldsEnum.CustomerForm2PassedPercent,
    ],
    [
      ConversionReportFieldsEnum.ContractSigningSuccessCount,
      ConversionReportFieldsEnum.ContractSigningSuccessPercent,
    ],
    [
      ConversionReportFieldsEnum.ContractSigningFailedCount,
      ConversionReportFieldsEnum.ContractSigningFailedPercent,
    ],
    [
      ConversionReportFieldsEnum.ContractSigningCancelledCount,
      ConversionReportFieldsEnum.ContractSigningCancelledPercent,
    ],
    [
      ConversionReportFieldsEnum.NorwayScoreFormSubmittedCount,
      ConversionReportFieldsEnum.NorwayScoreFormSubmittedPercent,
    ],
    [
      ConversionReportFieldsEnum.OtpCodeInitiatedCount,
      ConversionReportFieldsEnum.OtpCodeInitiatedPercent,
    ],
    [
      ConversionReportFieldsEnum.OtpCodeVerifiedCount,
      ConversionReportFieldsEnum.OtpCodeVerifiedPercent,
    ],
    [
      ConversionReportFieldsEnum.MarketingConsentGivenCount,
      ConversionReportFieldsEnum.MarketingConsentGivenPercent,
    ],
    [
      ConversionReportFieldsEnum.InsuranceConsentGivenCount,
      ConversionReportFieldsEnum.InsuranceConsentGivenPercent,
    ],
    [
      ConversionReportFieldsEnum.GeneralConsentGivenCount,
      ConversionReportFieldsEnum.GeneralConsentGivenPercent,
    ],
    [
      ConversionReportFieldsEnum.AnalyzeDocumentPassedCount,
      ConversionReportFieldsEnum.AnalyzeDocumentPassedPercent,
    ],
  ]);

export const DefaultPaymentMethodFieldsMapping: ConversionReportFieldsEnum[] = [
  ConversionReportFieldsEnum.FlowCount,
  ConversionReportFieldsEnum.NewPaymentCount,
  ConversionReportFieldsEnum.NewPaymentPercent,
  ConversionReportFieldsEnum.SuccessPaymentCount,
  ConversionReportFieldsEnum.SuccessPaymentPercent,
  ConversionReportFieldsEnum.PaidPaymentCount,
  ConversionReportFieldsEnum.PaidPaymentPercent,
];

export const DefaultPaymentMethodFormFieldsMapping: ConversionFormReportFieldsEnum[] = [
  ConversionFormReportFieldsEnum.CompletedForms,
  ConversionFormReportFieldsEnum.InCompletedForms,
];

export const PaymentMethodFieldsMapping: Map<PaymentMethodsEnum, ConversionReportFieldsEnum[]> =
  new Map<PaymentMethodsEnum, ConversionReportFieldsEnum[]>([
    [
      PaymentMethodsEnum.santanderDeInstallment,
      [
        ConversionReportFieldsEnum.FlowCount,
        ConversionReportFieldsEnum.RateStepPassedCount,
        ConversionReportFieldsEnum.RateStepPassedPercent,
        ConversionReportFieldsEnum.GeneralConsentGivenCount,
        ConversionReportFieldsEnum.GeneralConsentGivenPercent,
        ConversionReportFieldsEnum.InsuranceConsentGivenCount,
        ConversionReportFieldsEnum.InsuranceConsentGivenPercent,
        ConversionReportFieldsEnum.CustomerForm1PassedCount,
        ConversionReportFieldsEnum.CustomerForm1PassedPercent,
        ConversionReportFieldsEnum.CustomerForm2PassedCount,
        ConversionReportFieldsEnum.CustomerForm2PassedPercent,
        ConversionReportFieldsEnum.NewPaymentCount,
        ConversionReportFieldsEnum.NewPaymentPercent,
        ConversionReportFieldsEnum.SuccessPaymentCount,
        ConversionReportFieldsEnum.SuccessPaymentPercent,
        ConversionReportFieldsEnum.PaidPaymentCount,
        ConversionReportFieldsEnum.PaidPaymentPercent,
      ],
    ],
    [
      PaymentMethodsEnum.santanderDePosInstallment,
      [
        ConversionReportFieldsEnum.FlowCount,
        ConversionReportFieldsEnum.RateStepPassedCount,
        ConversionReportFieldsEnum.RateStepPassedPercent,
        ConversionReportFieldsEnum.GeneralConsentGivenCount,
        ConversionReportFieldsEnum.GeneralConsentGivenPercent,
        ConversionReportFieldsEnum.InsuranceConsentGivenCount,
        ConversionReportFieldsEnum.InsuranceConsentGivenPercent,
        ConversionReportFieldsEnum.MarketingConsentGivenCount,
        ConversionReportFieldsEnum.MarketingConsentGivenPercent,
        ConversionReportFieldsEnum.AnalyzeDocumentPassedCount,
        ConversionReportFieldsEnum.AnalyzeDocumentPassedPercent,
        ConversionReportFieldsEnum.CustomerForm1PassedCount,
        ConversionReportFieldsEnum.CustomerForm1PassedPercent,
        ConversionReportFieldsEnum.CustomerForm2PassedCount,
        ConversionReportFieldsEnum.CustomerForm2PassedPercent,
        ConversionReportFieldsEnum.NewPaymentCount,
        ConversionReportFieldsEnum.NewPaymentPercent,
        ConversionReportFieldsEnum.SuccessPaymentCount,
        ConversionReportFieldsEnum.SuccessPaymentPercent,
        ConversionReportFieldsEnum.PaidPaymentCount,
        ConversionReportFieldsEnum.PaidPaymentPercent,
      ],
    ],
    [
      PaymentMethodsEnum.santanderDeCcpInstallment,
      [
        ConversionReportFieldsEnum.FlowCount,
        ConversionReportFieldsEnum.RateStepPassedCount,
        ConversionReportFieldsEnum.RateStepPassedPercent,
        ConversionReportFieldsEnum.CustomerForm1PassedCount,
        ConversionReportFieldsEnum.CustomerForm1PassedPercent,
        ConversionReportFieldsEnum.CustomerForm2PassedCount,
        ConversionReportFieldsEnum.CustomerForm2PassedPercent,
        ConversionReportFieldsEnum.NewPaymentCount,
        ConversionReportFieldsEnum.NewPaymentPercent,
        ConversionReportFieldsEnum.SuccessPaymentCount,
        ConversionReportFieldsEnum.SuccessPaymentPercent,
        ConversionReportFieldsEnum.PaidPaymentCount,
        ConversionReportFieldsEnum.PaidPaymentPercent,
      ],
    ],
    [
      PaymentMethodsEnum.santanderDeFactoring,
      [
        ConversionReportFieldsEnum.FlowCount,
        ConversionReportFieldsEnum.RateSelectedCount,
        ConversionReportFieldsEnum.RateSelectedPercent,
        ConversionReportFieldsEnum.RateStepPassedCount,
        ConversionReportFieldsEnum.RateStepPassedPercent,
        ConversionReportFieldsEnum.NewPaymentCount,
        ConversionReportFieldsEnum.NewPaymentPercent,
        ConversionReportFieldsEnum.SuccessPaymentCount,
        ConversionReportFieldsEnum.SuccessPaymentPercent,
        ConversionReportFieldsEnum.PaidPaymentCount,
        ConversionReportFieldsEnum.PaidPaymentPercent,
      ],
    ],
    [
      PaymentMethodsEnum.santanderDePosFactoring,
      [
        ConversionReportFieldsEnum.FlowCount,
        ConversionReportFieldsEnum.RateSelectedCount,
        ConversionReportFieldsEnum.RateSelectedPercent,
        ConversionReportFieldsEnum.RateStepPassedCount,
        ConversionReportFieldsEnum.RateStepPassedPercent,
        ConversionReportFieldsEnum.NewPaymentCount,
        ConversionReportFieldsEnum.NewPaymentPercent,
        ConversionReportFieldsEnum.SuccessPaymentCount,
        ConversionReportFieldsEnum.SuccessPaymentPercent,
        ConversionReportFieldsEnum.PaidPaymentCount,
        ConversionReportFieldsEnum.PaidPaymentPercent,
      ],
    ],
    [
      PaymentMethodsEnum.santanderNoPosInstallment,
      [
        ConversionReportFieldsEnum.FlowCount,
        ConversionReportFieldsEnum.RateStepPassedCount,
        ConversionReportFieldsEnum.RateStepPassedPercent,
        ConversionReportFieldsEnum.GeneralConsentGivenCount,
        ConversionReportFieldsEnum.GeneralConsentGivenPercent,
        ConversionReportFieldsEnum.NewPaymentCount,
        ConversionReportFieldsEnum.NewPaymentPercent,
        ConversionReportFieldsEnum.SuccessPaymentCount,
        ConversionReportFieldsEnum.SuccessPaymentPercent,
        ConversionReportFieldsEnum.ContractSigningSuccessCount,
        ConversionReportFieldsEnum.ContractSigningSuccessPercent,
        ConversionReportFieldsEnum.PaidPaymentCount,
        ConversionReportFieldsEnum.PaidPaymentPercent,
      ],
    ],
    [
      PaymentMethodsEnum.santanderNoInstallment,
      [
        ConversionReportFieldsEnum.FlowCount,
        ConversionReportFieldsEnum.RateStepPassedCount,
        ConversionReportFieldsEnum.RateStepPassedPercent,
        ConversionReportFieldsEnum.GeneralConsentGivenCount,
        ConversionReportFieldsEnum.GeneralConsentGivenPercent,
        ConversionReportFieldsEnum.NewPaymentCount,
        ConversionReportFieldsEnum.NewPaymentPercent,
        ConversionReportFieldsEnum.SuccessPaymentCount,
        ConversionReportFieldsEnum.SuccessPaymentPercent,
        ConversionReportFieldsEnum.ContractSigningSuccessCount,
        ConversionReportFieldsEnum.ContractSigningSuccessPercent,
        ConversionReportFieldsEnum.PaidPaymentCount,
        ConversionReportFieldsEnum.PaidPaymentPercent,
      ],
    ],
    [
      PaymentMethodsEnum.santanderNoInvoice,
      [
        ...DefaultPaymentMethodFieldsMapping,
        ConversionReportFieldsEnum.ContractSigningSuccessCount,
        ConversionReportFieldsEnum.ContractSigningSuccessPercent,
        ConversionReportFieldsEnum.PaidPaymentCount,
        ConversionReportFieldsEnum.PaidPaymentPercent,
      ],
    ],
    [
      PaymentMethodsEnum.santanderNoPosInvoice,
      [
        ...DefaultPaymentMethodFieldsMapping,
        ConversionReportFieldsEnum.ContractSigningSuccessCount,
        ConversionReportFieldsEnum.ContractSigningSuccessPercent,
        ConversionReportFieldsEnum.PaidPaymentCount,
        ConversionReportFieldsEnum.PaidPaymentPercent,
      ],
    ],
    [
      PaymentMethodsEnum.santanderDkInstallment,
      [
        ConversionReportFieldsEnum.FlowCount,
        ConversionReportFieldsEnum.RateStepPassedCount,
        ConversionReportFieldsEnum.RateStepPassedPercent,
        ConversionReportFieldsEnum.GeneralConsentGivenCount,
        ConversionReportFieldsEnum.GeneralConsentGivenPercent,
        ConversionReportFieldsEnum.MarketingConsentGivenCount,
        ConversionReportFieldsEnum.MarketingConsentGivenPercent,
        ConversionReportFieldsEnum.MitIdStepPassedCount,
        ConversionReportFieldsEnum.MitIdStepPassedPercent,
        ConversionReportFieldsEnum.SkatStepPassedCount,
        ConversionReportFieldsEnum.SkatStepPassedPercent,
        ConversionReportFieldsEnum.BankConsentStepPassedCount,
        ConversionReportFieldsEnum.BankConsentStepPassedPercent,
        ConversionReportFieldsEnum.NewPaymentCount,
        ConversionReportFieldsEnum.NewPaymentPercent,
        ConversionReportFieldsEnum.SuccessPaymentCount,
        ConversionReportFieldsEnum.SuccessPaymentPercent,
        ConversionReportFieldsEnum.ContractSigningSuccessCount,
        ConversionReportFieldsEnum.ContractSigningSuccessPercent,
        ConversionReportFieldsEnum.PaidPaymentCount,
        ConversionReportFieldsEnum.PaidPaymentPercent,
      ],
    ],
    [
      PaymentMethodsEnum.santanderDkPosInstallment,
      [
        ConversionReportFieldsEnum.FlowCount,
        ConversionReportFieldsEnum.RateStepPassedCount,
        ConversionReportFieldsEnum.RateStepPassedPercent,
        ConversionReportFieldsEnum.MitIdStepPassedCount,
        ConversionReportFieldsEnum.MitIdStepPassedPercent,
        ConversionReportFieldsEnum.SkatStepPassedCount,
        ConversionReportFieldsEnum.SkatStepPassedPercent,
        ConversionReportFieldsEnum.BankConsentStepPassedCount,
        ConversionReportFieldsEnum.BankConsentStepPassedPercent,
        ConversionReportFieldsEnum.NewPaymentCount,
        ConversionReportFieldsEnum.NewPaymentPercent,
        ConversionReportFieldsEnum.SuccessPaymentCount,
        ConversionReportFieldsEnum.SuccessPaymentPercent,
        ConversionReportFieldsEnum.ContractSigningSuccessCount,
        ConversionReportFieldsEnum.ContractSigningSuccessPercent,
        ConversionReportFieldsEnum.PaidPaymentCount,
        ConversionReportFieldsEnum.PaidPaymentPercent,
      ],
    ],
    [
      PaymentMethodsEnum.santanderSeInstallment,
      [
        ConversionReportFieldsEnum.FlowCount,
        ConversionReportFieldsEnum.RateStepPassedCount,
        ConversionReportFieldsEnum.RateStepPassedPercent,
        ConversionReportFieldsEnum.GeneralConsentGivenCount,
        ConversionReportFieldsEnum.GeneralConsentGivenPercent,
        ConversionReportFieldsEnum.BankIdStepPassedCount,
        ConversionReportFieldsEnum.BankIdStepPassedPercent,
        ConversionReportFieldsEnum.NewPaymentCount,
        ConversionReportFieldsEnum.NewPaymentPercent,
        ConversionReportFieldsEnum.SuccessPaymentCount,
        ConversionReportFieldsEnum.SuccessPaymentPercent,
        ConversionReportFieldsEnum.ContractSigningSuccessCount,
        ConversionReportFieldsEnum.ContractSigningSuccessPercent,
        ConversionReportFieldsEnum.PaidPaymentCount,
        ConversionReportFieldsEnum.PaidPaymentPercent,
      ],
    ],
    [
      PaymentMethodsEnum.santanderSePosInstallment,
      [
        ConversionReportFieldsEnum.FlowCount,
        ConversionReportFieldsEnum.RateStepPassedCount,
        ConversionReportFieldsEnum.RateStepPassedPercent,
        ConversionReportFieldsEnum.GeneralConsentGivenCount,
        ConversionReportFieldsEnum.GeneralConsentGivenPercent,
        ConversionReportFieldsEnum.BankIdStepPassedCount,
        ConversionReportFieldsEnum.BankIdStepPassedPercent,
        ConversionReportFieldsEnum.NewPaymentCount,
        ConversionReportFieldsEnum.NewPaymentPercent,
        ConversionReportFieldsEnum.SuccessPaymentCount,
        ConversionReportFieldsEnum.SuccessPaymentPercent,
        ConversionReportFieldsEnum.ContractSigningSuccessCount,
        ConversionReportFieldsEnum.ContractSigningSuccessPercent,
        ConversionReportFieldsEnum.PaidPaymentCount,
        ConversionReportFieldsEnum.PaidPaymentPercent,
      ],
    ],
    [
      PaymentMethodsEnum.ziniaBnplDe,
      [
        ConversionReportFieldsEnum.FlowCount,
        ConversionReportFieldsEnum.GeneralConsentGivenCount,
        ConversionReportFieldsEnum.GeneralConsentGivenPercent,
        ConversionReportFieldsEnum.MarketingConsentGivenCount,
        ConversionReportFieldsEnum.MarketingConsentGivenPercent,
        ConversionReportFieldsEnum.NewPaymentCount,
        ConversionReportFieldsEnum.NewPaymentPercent,
        ConversionReportFieldsEnum.OtpCodeInitiatedCount,
        ConversionReportFieldsEnum.OtpCodeInitiatedPercent,
        ConversionReportFieldsEnum.SuccessExcludeFailedPaymentCount,
        ConversionReportFieldsEnum.SuccessExcludeFailedPaymentPercent,
        ConversionReportFieldsEnum.OtpCodeVerifiedCount,
        ConversionReportFieldsEnum.OtpCodeVerifiedPercent,
        ConversionReportFieldsEnum.PaidPaymentCount,
        ConversionReportFieldsEnum.PaidPaymentPercent,
        ConversionReportFieldsEnum.DeclinedPaymentCount,
        ConversionReportFieldsEnum.DeclinedPaymentPercent,
        ConversionReportFieldsEnum.FailedPaymentCount,
        ConversionReportFieldsEnum.FailedPaymentPercent,
      ],
    ],
    [
      PaymentMethodsEnum.ziniaInstallmentDe,
      [
        ConversionReportFieldsEnum.FlowCount,
        ConversionReportFieldsEnum.GeneralConsentGivenCount,
        ConversionReportFieldsEnum.GeneralConsentGivenPercent,
        ConversionReportFieldsEnum.MarketingConsentGivenCount,
        ConversionReportFieldsEnum.MarketingConsentGivenPercent,
        ConversionReportFieldsEnum.NewPaymentCount,
        ConversionReportFieldsEnum.NewPaymentPercent,
        ConversionReportFieldsEnum.OtpCodeInitiatedCount,
        ConversionReportFieldsEnum.OtpCodeInitiatedPercent,
        ConversionReportFieldsEnum.SuccessExcludeFailedPaymentCount,
        ConversionReportFieldsEnum.SuccessExcludeFailedPaymentPercent,
        ConversionReportFieldsEnum.OtpCodeVerifiedCount,
        ConversionReportFieldsEnum.OtpCodeVerifiedPercent,
        ConversionReportFieldsEnum.PaidPaymentCount,
        ConversionReportFieldsEnum.PaidPaymentPercent,
        ConversionReportFieldsEnum.DeclinedPaymentCount,
        ConversionReportFieldsEnum.DeclinedPaymentPercent,
        ConversionReportFieldsEnum.FailedPaymentCount,
        ConversionReportFieldsEnum.FailedPaymentPercent,
      ],
    ],
    [
      PaymentMethodsEnum.ziniaSliceThreeDe,
      [
        ConversionReportFieldsEnum.FlowCount,
        ConversionReportFieldsEnum.NewPaymentCount,
        ConversionReportFieldsEnum.NewPaymentPercent,
        ConversionReportFieldsEnum.OtpCodeInitiatedCount,
        ConversionReportFieldsEnum.OtpCodeInitiatedPercent,
        ConversionReportFieldsEnum.SuccessExcludeFailedPaymentCount,
        ConversionReportFieldsEnum.SuccessExcludeFailedPaymentPercent,
        ConversionReportFieldsEnum.OtpCodeVerifiedCount,
        ConversionReportFieldsEnum.OtpCodeVerifiedPercent,
        ConversionReportFieldsEnum.PaidPaymentCount,
        ConversionReportFieldsEnum.PaidPaymentPercent,
        ConversionReportFieldsEnum.DeclinedPaymentCount,
        ConversionReportFieldsEnum.DeclinedPaymentPercent,
        ConversionReportFieldsEnum.FailedPaymentCount,
        ConversionReportFieldsEnum.FailedPaymentPercent,
      ],
    ],
  ]);


export const PaymentMethodFormFieldsMapping: Map<PaymentMethodsEnum, ConversionFormReportFieldsEnum[]> =
  new Map<PaymentMethodsEnum, ConversionFormReportFieldsEnum[]>([
    [
      PaymentMethodsEnum.santanderDeInstallment,
      [
        ...DefaultPaymentMethodFormFieldsMapping,
      ],
    ],
    [
      PaymentMethodsEnum.santanderDePosInstallment,
      [
        ...DefaultPaymentMethodFormFieldsMapping,
      ],
    ],
    [
      PaymentMethodsEnum.santanderDeCcpInstallment,
      [
        ...DefaultPaymentMethodFormFieldsMapping,
      ],
    ],
    [
      PaymentMethodsEnum.santanderDeFactoring,
      [
        ...DefaultPaymentMethodFormFieldsMapping,
      ],
    ],
    [
      PaymentMethodsEnum.santanderDePosFactoring,
      [
        ...DefaultPaymentMethodFormFieldsMapping,
      ],
    ],
    [
      PaymentMethodsEnum.santanderNoPosInstallment,
      [
        ...DefaultPaymentMethodFormFieldsMapping,
      ],
    ],
    [
      PaymentMethodsEnum.santanderNoInstallment,
      [
        ...DefaultPaymentMethodFormFieldsMapping,
      ],
    ],
    [
      PaymentMethodsEnum.santanderNoInvoice,
      [
        ...DefaultPaymentMethodFormFieldsMapping,
      ],
    ],
    [
      PaymentMethodsEnum.santanderNoPosInvoice,
      [
        ...DefaultPaymentMethodFormFieldsMapping,
      ],
    ],
    [
      PaymentMethodsEnum.santanderDkInstallment,
      [
        ...DefaultPaymentMethodFormFieldsMapping,
      ],
    ],
    [
      PaymentMethodsEnum.santanderDkPosInstallment,
      [
        ...DefaultPaymentMethodFormFieldsMapping,
      ],
    ],
    [
      PaymentMethodsEnum.santanderSeInstallment,
      [
        ...DefaultPaymentMethodFormFieldsMapping,
      ],
    ],
    [
      PaymentMethodsEnum.santanderSePosInstallment,
      [
        ...DefaultPaymentMethodFormFieldsMapping,
      ],
    ],
  ]);

export const ConversionTitleFieldsMapping: Map<ConversionReportFieldsEnum, string> =
  new Map<ConversionReportFieldsEnum, string>([
    [
      ConversionReportFieldsEnum.FlowCount,
      'Payment flow count',
    ],
    [
      ConversionReportFieldsEnum.NewPaymentCount,
      'Payment submit count',
    ],
    [
      ConversionReportFieldsEnum.NewPaymentPercent,
      '% Submit',
    ],
    [
      ConversionReportFieldsEnum.SuccessPaymentCount,
      'Success submit count',
    ],
    [
      ConversionReportFieldsEnum.SuccessPaymentPercent,
      '% Success submit',
    ],
    [
      ConversionReportFieldsEnum.SuccessExcludeFailedPaymentCount,
      'Success submit count',
    ],
    [
      ConversionReportFieldsEnum.SuccessExcludeFailedPaymentPercent,
      '% Success submit',
    ],
    [
      ConversionReportFieldsEnum.DeclinedPaymentCount,
      'Declined submit count',
    ],
    [
      ConversionReportFieldsEnum.DeclinedPaymentPercent,
      '% Declined submit',
    ],
    [
      ConversionReportFieldsEnum.FailedPaymentCount,
      'Failed submit count',
    ],
    [
      ConversionReportFieldsEnum.FailedPaymentPercent,
      '% Failed submit',
    ],
    [
      ConversionReportFieldsEnum.PaidPaymentCount,
      'Paid payments (STATUS_PAID)',
    ],
    [
      ConversionReportFieldsEnum.PaidPaymentPercent,
      '% Paid payments (STATUS_PAID)',
    ],
    [
      ConversionReportFieldsEnum.RateSelectedCount,
      'Rate selected',
    ],
    [
      ConversionReportFieldsEnum.RateSelectedPercent,
      '% Rate selected',
    ],
    [
      ConversionReportFieldsEnum.RateStepPassedCount,
      'Rate step passed',
    ],
    [
      ConversionReportFieldsEnum.RateStepPassedPercent,
      '% Rate step passed',
    ],
    [
      ConversionReportFieldsEnum.MitIdStepPassedCount,
      'MitId step passed',
    ],
    [
      ConversionReportFieldsEnum.MitIdStepPassedPercent,
      '% MitId step passed',
    ],
    [
      ConversionReportFieldsEnum.SkatStepPassedCount,
      'SKAT step passed',
    ],
    [
      ConversionReportFieldsEnum.SkatStepPassedPercent,
      '% SKAT step passed',
    ],
    [
      ConversionReportFieldsEnum.BankConsentStepPassedCount,
      'Bank consent step passed',
    ],
    [
      ConversionReportFieldsEnum.BankConsentStepPassedPercent,
      '% Bank consent step passed',
    ],
    [
      ConversionReportFieldsEnum.BankIdStepPassedCount,
      'Bank id step passed',
    ],
    [
      ConversionReportFieldsEnum.BankIdStepPassedPercent,
      '% Bank id step passed',
    ],
    [
      ConversionReportFieldsEnum.CustomerForm1PassedCount,
      'Customer form 1 passed',
    ],
    [
      ConversionReportFieldsEnum.CustomerForm1PassedPercent,
      '% Customer form 1 passed',
    ],
    [
      ConversionReportFieldsEnum.CustomerForm2PassedCount,
      'Customer form 2 passed',
    ],
    [
      ConversionReportFieldsEnum.CustomerForm2PassedPercent,
      '% Customer form 2 passed',
    ],
    [
      ConversionReportFieldsEnum.ContractSigningSuccessCount,
      'Contract success',
    ],
    [
      ConversionReportFieldsEnum.ContractSigningSuccessPercent,
      '% Contract success',
    ],
    [
      ConversionReportFieldsEnum.ContractSigningFailedCount,
      'Contract failed',
    ],
    [
      ConversionReportFieldsEnum.ContractSigningFailedPercent,
      '% Contract failed',
    ],
    [
      ConversionReportFieldsEnum.ContractSigningCancelledCount,
      'Contract cancelled',
    ],
    [
      ConversionReportFieldsEnum.ContractSigningCancelledPercent,
      '% Contract cancelled',
    ],
    [
      ConversionReportFieldsEnum.NorwayScoreFormSubmittedCount,
      'Norway second form submitted',
    ],
    [
      ConversionReportFieldsEnum.NorwayScoreFormSubmittedPercent,
      '% Norway second form submitted',
    ],
    [
      ConversionReportFieldsEnum.OtpCodeInitiatedCount,
      'OTP Code Initiated',
    ],
    [
      ConversionReportFieldsEnum.OtpCodeInitiatedPercent,
      '% OTP Code Initiated',
    ],
    [
      ConversionReportFieldsEnum.OtpCodeVerifiedCount,
      'OTP Code Verified',
    ],
    [
      ConversionReportFieldsEnum.OtpCodeVerifiedPercent,
      '% OTP Code Verified',
    ],
    [
      ConversionReportFieldsEnum.MarketingConsentGivenCount,
      'Marketing consent',
    ],
    [
      ConversionReportFieldsEnum.MarketingConsentGivenPercent,
      '% Marketing consent',
    ],
    [
      ConversionReportFieldsEnum.InsuranceConsentGivenCount,
      'Insurance consent',
    ],
    [
      ConversionReportFieldsEnum.InsuranceConsentGivenPercent,
      '% Insurance consent',
    ],
    [
      ConversionReportFieldsEnum.GeneralConsentGivenCount,
      'General consent',
    ],
    [
      ConversionReportFieldsEnum.GeneralConsentGivenPercent,
      '% General consent',
    ],
    [
      ConversionReportFieldsEnum.AnalyzeDocumentPassedCount,
      'Analyze doc step passed',
    ],
    [
      ConversionReportFieldsEnum.AnalyzeDocumentPassedPercent,
      '% Analyze doc step passed',
    ],
  ]);

export const ConversionFormTitleFieldsMapping: Map<ConversionFormReportFieldsEnum, string> =
    new Map<ConversionFormReportFieldsEnum, string>([
      [
        ConversionFormReportFieldsEnum.CompletedForms,
        '% Completed forms',
      ],
      [
        ConversionFormReportFieldsEnum.InCompletedForms,
        '% Incompleted forms',
      ],
    ]);
