import { Injectable, Logger } from '@nestjs/common';
import { CustomTransportStrategy, Server } from '@nestjs/microservices';
import { BusinessExporterService } from '../services';
import * as moment from 'moment';
import { Cron } from '@pe/cron-kit';

@Injectable()
export class BusinessExportReportCron {
  constructor(
    protected readonly logger: Logger,
    private readonly businessExporterService: BusinessExporterService,

  ) { }

  @Cron('0 0 30 * 1')
  public async sendMonthlyBusinessReport(): Promise<void> {
    this.logger.log('Business cron: Starting Monthly business export report sending...');

    try {
      const startDate: Date = moment().day(-29).toDate();
      startDate.setUTCHours(0, 0, 0, 0);
      const endDate: Date = moment().day(0).toDate();
      endDate.setUTCHours(23, 59, 59, 999);
      await this.businessExporterService.export(
        startDate,
        endDate,
        ['santander'],
      );
    } catch (error) {
      this.logger.error({
        error: error.message,
        message: 'Business cron: Failed to send monthly business export report',
      });
    }
  }
}
