import { Injectable } from '@nestjs/common';
import {
  ConversionFormReportDto,
  ConversionPaymentMethodFormReportDto,
} from '../../dto/volume-report/conversion-form-report';
import { VolumeReportCheckoutFormMetricsRetriever } from './volume-report-checkout-form-metrics.retriever';
import {
  PaymentMethodsEnum,
  ConversionFormReportFieldsEnum,
} from '../../enums';
import { DateRangeService } from './date-range.service';

@Injectable()
export class ConversionFormReportManager {
  constructor(
    private readonly checkoutFormMetricsRetriever: VolumeReportCheckoutFormMetricsRetriever,
  ) { }

  public async prepareConversionReportFromDb(
    dateFrom: Date,
    dateTo: Date,
  ): Promise<ConversionFormReportDto> {
    const conversionFormReport: ConversionFormReportDto = new ConversionFormReportDto();
    conversionFormReport.reportDate = DateRangeService.getFormattedReportDateRange(dateFrom, dateTo);

    for (const paymentMethod of Object.values(PaymentMethodsEnum)) {
      conversionFormReport.paymentMethodsFormReports.push(
        new ConversionPaymentMethodFormReportDto(paymentMethod),
      );
    }

    for (const paymentMethodReport of conversionFormReport.paymentMethodsFormReports) {
      const allForms: number = await this.checkoutFormMetricsRetriever.countAllForms(
        dateFrom,
        dateTo,
        null,
        paymentMethodReport.paymentMethod,
      );

      const forms: any[] = await this.checkoutFormMetricsRetriever.allForms(
        dateFrom,
        dateTo,
        null,
        paymentMethodReport.paymentMethod,
      );
      paymentMethodReport.forms = forms.map((item: any) => ({
        count: item.count,
        name: item._id,
        percent: (item.count / allForms) * 100,
      }));

      const fields: any[] = await this.checkoutFormMetricsRetriever.allFields(
        dateFrom,
        dateTo,
        null,
        paymentMethodReport.paymentMethod,
      );
      paymentMethodReport.fields = fields.map((item: any) => ({
        count: item.count,
        name: item._id,
        percent: (item.count / allForms) * 100,
      }));

      const incompletedForms: number =
        await this.checkoutFormMetricsRetriever.countNotCompletedForms(
          dateFrom,
          dateTo,
          null,
          paymentMethodReport.paymentMethod,
        );

      paymentMethodReport[ConversionFormReportFieldsEnum.AllForms] = allForms;
      paymentMethodReport[ConversionFormReportFieldsEnum.InCompletedForms] = (incompletedForms / allForms) * 100;
      paymentMethodReport[ConversionFormReportFieldsEnum.CompletedForms] =
        ((allForms - incompletedForms) / allForms) * 100;
    }

    return conversionFormReport;
  }
}
