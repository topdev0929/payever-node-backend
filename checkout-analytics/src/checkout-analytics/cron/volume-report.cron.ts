import { Injectable, Logger } from '@nestjs/common';
import { CustomTransportStrategy, Server } from '@nestjs/microservices';
import * as cron from 'node-cron';
import { VolumeReportSender } from '../services';
import * as moment from 'moment';
import { ReportCountriesEnum } from '../enums';

@Injectable()
export class VolumeReportCron extends Server implements CustomTransportStrategy {
  constructor(
    protected readonly logger: Logger,
    private readonly volumeReportSender: VolumeReportSender,
  ) {
    super();
  }

  public async listen(callback: () => void): Promise<void> {
    await cron.schedule('0 6 1 * *', () => this.sendVolumeReport());
    await cron.schedule('0 6 * * 1', () => this.sendWeeklyVolumeReport());
    this.logger.log('Checkout analytics cron: Configured cron schedule for volume report');

    callback();
  }

  public async close(): Promise<void> {
    return null;
  }

  public async sendVolumeReport(): Promise<void> {
    this.logger.log('Checkout analytics cron: Starting volume report sending...');

    try {
      const countryKeys: string[] = [...Object.keys(ReportCountriesEnum), null];
      for (const countryKey of countryKeys) {
        const country: ReportCountriesEnum = ReportCountriesEnum[countryKey];

        await this.volumeReportSender.loadFromDbAndSendToEmailVolumeReport({ country });
      }
    } catch (error) {
      this.logger.error({
        error: error.message,
        message: 'Checkout analytics cron: Failed to send volume report',
      });
    }
  }

  public async sendWeeklyVolumeReport(): Promise<void> {
    this.logger.log('Checkout analytics cron: Starting weekly volume report sending...');

    try {
      const startDate: Date = moment().day(-6).toDate();
      startDate.setUTCHours(0, 0, 0, 0);
      const endDate: Date = moment().day(0).toDate();
      endDate.setUTCHours(23, 59, 59, 999);

      const previousStartDate: Date = moment().day(-13).toDate();
      previousStartDate.setUTCHours(0, 0, 0, 0);
      const previousEndDate: Date = moment().day(-7).toDate();
      previousEndDate.setUTCHours(23, 59, 59, 999);

      await this.volumeReportSender.loadFromDbAndSendToEmailVolumeReport(
        {
          country: null,
          dateFrom: startDate,
          dateTo: endDate,
          previousDateFrom: previousStartDate,
          previousDateTo: previousEndDate,
        }
      );
    } catch (error) {
      this.logger.error({
        error: error.message,
        message: 'Checkout analytics cron: Failed to send weekly volume report',
      });
    }
  }
}
