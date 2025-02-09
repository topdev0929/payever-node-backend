import { Injectable, Logger } from '@nestjs/common';
import { CustomTransportStrategy, Server } from '@nestjs/microservices';
import * as cron from 'node-cron';
import { DateRangeService, VolumeReportManager } from '../services';
import { ReportTypesEnum } from '../enums/report-types.enum';
import { ReportCountriesEnum } from '../enums';

@Injectable()
export class ReportToDbCron extends Server implements CustomTransportStrategy {
  constructor(
    protected readonly logger: Logger,
    private readonly volumeReportManager: VolumeReportManager,
  ) {
    super();
  }

  public async listen(callback: () => void): Promise<void> {
    await cron.schedule('0 2 * * *', () => this.processReport(ReportTypesEnum.merchantsAndConversion));
    await cron.schedule('30 2 * * *', () => this.processReport(ReportTypesEnum.responseTime));
    await cron.schedule('0 3 * * *', () => this.processReport(ReportTypesEnum.devices));
    await cron.schedule('0 5 1 1 *', () => this.processReport(ReportTypesEnum.chartsPrevYear));
    this.logger.log('Checkout analytics cron: Configured cron schedule for report to DB saving');

    callback();
  }

  public async close(): Promise<void> {
    return null;
  }

  public async processReport(type: ReportTypesEnum): Promise<void> {
    this.logger.log(`Checkout analytics cron: Starting  ${type} report to DB saving...`);

    const from: Date = type === ReportTypesEnum.chartsPrevYear ? new Date() : DateRangeService.getPrevDay(true);
    const to: Date = type === ReportTypesEnum.chartsPrevYear ? new Date() : DateRangeService.getPrevDay(false);

    try {
      const countryKeys: string[] = [...Object.keys(ReportCountriesEnum), null];
      for (const countryKey of countryKeys) {
        const country: ReportCountriesEnum = ReportCountriesEnum[countryKey];
        await this.volumeReportManager.generateAndSaveReportToDbByType(type, country, from, to);
      }
    } catch (error) {
      this.logger.error({
        error: error.message,
        message: `Checkout analytics cron: Failed to save ${type} report to DB`,
      });
    }
  }
}
