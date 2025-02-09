import { StateReportDto } from '../../dto/volume-report';
import { ConversionStateReportDto } from '../../dto/volume-report/conversion-state-report.dto';
import { ConversionPercentageFieldsMapping, ConversionReportFieldsEnum } from '../../enums';

export class StatisticsCalculator {
  public static calculateReportStatistics(report: StateReportDto, rootReport: StateReportDto): void {
    if (!report.transactionsCount) {
      return;
    }

    report.averageTicketTotal = this.calculateAverageTicketTotal(
      report.volumeTotal,
      report.transactionsCount,
    );

    report.transactionsPercent = this.calculateTransactionsPercent(
      report.transactionsCount,
      rootReport.transactionsCount,
    );

    report.volumePercent = this.calculateVolumePercent(
      report.volumeTotal,
      rootReport.volumeTotal,
    );
  }

  public static calculateConversionStatistics(report: ConversionStateReportDto): void {
    for (const [countFieldName, percentFieldName] of ConversionPercentageFieldsMapping) {
      report[percentFieldName] =
        report[ConversionReportFieldsEnum.FlowCount] > 0
          ? this.calculateProportion(report[countFieldName], report[ConversionReportFieldsEnum.FlowCount])
          : 0.0;
    }
  }

  public static sumStateReports(target: StateReportDto, source: StateReportDto): void {
    target.transactionsCount += source.transactionsCount;
    target.volumeTotal += source.volumeTotal;
    target.activeMerchants = [...new Set(target.activeMerchants.concat(source.activeMerchants))];
  }

  public static incrementStateReportTransactionCountAndTotal(stateReport: StateReportDto, total: number): void {
    stateReport.transactionsCount++;
    stateReport.volumeTotal += total;
  }

  public static addStateReportActiveMerchant(stateReport: StateReportDto, businessId: string): void {
    if (!stateReport.activeMerchants.includes(businessId)) {
      stateReport.activeMerchants.push(businessId);
    }
  }

  private static calculateAverageTicketTotal(
    volumeTotal: number,
    transactionsCount: number,
  ): number {
    return volumeTotal / transactionsCount;
  }

  private static calculateTransactionsPercent(
    transactionsCount: number,
    totalTransactionsCount: number,
  ): number {
    return this.calculateProportion(transactionsCount, totalTransactionsCount);
  }

  private static calculateVolumePercent(
    volume: number,
    volumeTotal: number,
  ): number {
    return this.calculateProportion(volume, volumeTotal);
  }

  private static calculateProportion($value: number, $totalValue: number): number {
    return $value * 100 / $totalValue;
  }
}
