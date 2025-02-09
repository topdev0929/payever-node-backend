import { Injectable, Logger } from '@nestjs/common';
import { Cron } from '@pe/cron-kit';
import { ReportDurationEnum } from '../transactions/enum';
import {
  SettlementReportScheduleService,
} from '../transactions/services';

@Injectable()
export class SettlementReportCronService {
  constructor(
    private readonly scheduleService: SettlementReportScheduleService,
  ) { }

  @Cron('0 0 1 * *', { name: 'Scheduled Monthly Settlement Payment Report' })
  public async sendMonthlySettlementReport(): Promise<void> {
    await this.scheduleService.sendScheduledReports(ReportDurationEnum.Monthly);
  }

  @Cron('0 0 * * *', { name: 'Scheduled Daily Settlement Payment Report' })
  public async sendDailySettlementReport(): Promise<void> {
    await this.scheduleService.sendScheduledReports(ReportDurationEnum.Daily);
  }

  @Cron('0 0 * * 6', { name: 'Scheduled Weekly Settlement Payment Report' })
  public async sendWeeklySettlementReport(): Promise<void> {
    await this.scheduleService.sendScheduledReports(ReportDurationEnum.Weekly);
  }
}
