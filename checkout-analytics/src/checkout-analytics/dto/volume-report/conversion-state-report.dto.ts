import { IsNumber } from 'class-validator';
import { Exclude, Expose } from 'class-transformer';
import { ConversionReportFieldsEnum } from '../../enums';

@Exclude()
export class ConversionStateReportDto {
  @IsNumber()
  @Expose()
  public [ConversionReportFieldsEnum.FlowCount]: number = 0;

  @IsNumber()
  @Expose()
  public [ConversionReportFieldsEnum.NewPaymentCount]: number = 0;

  @IsNumber()
  @Expose()
  public [ConversionReportFieldsEnum.NewPaymentPercent]: number = 0.0;

  @IsNumber()
  @Expose()
  public [ConversionReportFieldsEnum.SuccessPaymentCount]: number = 0;

  @IsNumber()
  @Expose()
  public [ConversionReportFieldsEnum.SuccessPaymentPercent]: number = 0.0;

  @IsNumber()
  @Expose()
  public [ConversionReportFieldsEnum.SuccessExcludeFailedPaymentCount]: number = 0;

  @IsNumber()
  @Expose()
  public [ConversionReportFieldsEnum.SuccessExcludeFailedPaymentPercent]: number = 0.0;

  @IsNumber()
  @Expose()
  public [ConversionReportFieldsEnum.PaidPaymentCount]: number = 0;

  @IsNumber()
  @Expose()
  public [ConversionReportFieldsEnum.PaidPaymentPercent]: number = 0.0;

  @IsNumber()
  @Expose()
  public [ConversionReportFieldsEnum.DeclinedPaymentCount]: number = 0;

  @IsNumber()
  @Expose()
  public [ConversionReportFieldsEnum.DeclinedPaymentPercent]: number = 0.0;

  @IsNumber()
  @Expose()
  public [ConversionReportFieldsEnum.FailedPaymentCount]: number = 0;

  @IsNumber()
  @Expose()
  public [ConversionReportFieldsEnum.FailedPaymentPercent]: number = 0.0;

  @IsNumber()
  @Expose()
  public [ConversionReportFieldsEnum.RateSelectedCount]: number = 0;

  @IsNumber()
  @Expose()
  public [ConversionReportFieldsEnum.RateSelectedPercent]: number = 0.0;

  @IsNumber()
  @Expose()
  public [ConversionReportFieldsEnum.RateStepPassedCount]: number = 0;

  @IsNumber()
  @Expose()
  public [ConversionReportFieldsEnum.RateStepPassedPercent]: number = 0.0;

  @IsNumber()
  @Expose()
  public [ConversionReportFieldsEnum.MitIdStepPassedCount]: number = 0;

  @IsNumber()
  @Expose()
  public [ConversionReportFieldsEnum.MitIdStepPassedPercent]: number = 0.0;

  @IsNumber()
  @Expose()
  public [ConversionReportFieldsEnum.SkatStepPassedCount]: number = 0;

  @IsNumber()
  @Expose()
  public [ConversionReportFieldsEnum.SkatStepPassedPercent]: number = 0.0;

  @IsNumber()
  @Expose()
  public [ConversionReportFieldsEnum.BankConsentStepPassedCount]: number = 0;

  @IsNumber()
  @Expose()
  public [ConversionReportFieldsEnum.BankConsentStepPassedPercent]: number = 0.0;

  @IsNumber()
  @Expose()
  public [ConversionReportFieldsEnum.BankIdStepPassedCount]: number = 0;

  @IsNumber()
  @Expose()
  public [ConversionReportFieldsEnum.BankIdStepPassedPercent]: number = 0.0;

  @IsNumber()
  @Expose()
  public [ConversionReportFieldsEnum.CustomerForm1PassedCount]: number = 0;

  @IsNumber()
  @Expose()
  public [ConversionReportFieldsEnum.CustomerForm1PassedPercent]: number = 0.0;

  @IsNumber()
  @Expose()
  public [ConversionReportFieldsEnum.CustomerForm2PassedCount]: number = 0;

  @IsNumber()
  @Expose()
  public [ConversionReportFieldsEnum.CustomerForm2PassedPercent]: number = 0.0;

  @IsNumber()
  @Expose()
  public [ConversionReportFieldsEnum.ContractSigningSuccessCount]: number = 0;

  @IsNumber()
  @Expose()
  public [ConversionReportFieldsEnum.ContractSigningSuccessPercent]: number = 0.0;

  @IsNumber()
  @Expose()
  public [ConversionReportFieldsEnum.ContractSigningFailedCount]: number = 0;

  @IsNumber()
  @Expose()
  public [ConversionReportFieldsEnum.ContractSigningFailedPercent]: number = 0.0;

  @IsNumber()
  @Expose()
  public [ConversionReportFieldsEnum.ContractSigningCancelledCount]: number = 0;

  @IsNumber()
  @Expose()
  public [ConversionReportFieldsEnum.ContractSigningCancelledPercent]: number = 0.0;

  @IsNumber()
  @Expose()
  public [ConversionReportFieldsEnum.NorwayScoreFormSubmittedCount]: number = 0;

  @IsNumber()
  @Expose()
  public [ConversionReportFieldsEnum.NorwayScoreFormSubmittedPercent]: number = 0.0;

  @IsNumber()
  @Expose()
  public [ConversionReportFieldsEnum.OtpCodeInitiatedCount]: number = 0;

  @IsNumber()
  @Expose()
  public [ConversionReportFieldsEnum.OtpCodeInitiatedPercent]: number = 0.0;

  @IsNumber()
  @Expose()
  public [ConversionReportFieldsEnum.OtpCodeVerifiedCount]: number = 0;

  @IsNumber()
  @Expose()
  public [ConversionReportFieldsEnum.OtpCodeVerifiedPercent]: number = 0.0;
}
