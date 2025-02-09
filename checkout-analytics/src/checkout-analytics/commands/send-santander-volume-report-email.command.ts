import { BadRequestException, Injectable } from '@nestjs/common';
import { Command, Option } from '@pe/nest-kit';
import { VolumeReportManager, VolumeReportSender } from '../services';
import * as dateFns from 'date-fns';
import { ReportCountriesEnum } from '../enums';

@Injectable()
export class SendSantanderVolumeReportEmailCommand {
  constructor(
    private readonly reportSender: VolumeReportSender,
    private readonly reportManager: VolumeReportManager,
  ) { }

  @Command({
    command: 'santander:volume-report:send [--from] [--to] [--load-from-db] [--country]',
    describe: 'Create and send to email volume report for Santander',
  })
  public async sendVolumeReportEmail(
    @Option({ name: 'from' }) dateFrom?: string,
    @Option({ name: 'to' }) dateTo?: string,
    @Option({ name: 'country' }) countryParam?: string,
    @Option({ name: 'load-from-db' }) loadFromDb: boolean = false,
  ): Promise<void> {
    let modifiedFrom: Date = null;
    let modifiedTo: Date = null;
    let modifiedPrevFrom: Date = null;
    let modifiedPrevTo: Date = null;

    if (dateFrom && dateTo) {
      modifiedFrom = new Date(dateFrom);
      modifiedTo = new Date(dateTo);
      const daysDiff: number = dateFns.differenceInCalendarDays(modifiedFrom, modifiedTo);
      modifiedFrom.setUTCHours(0, 0, 0, 0);
      modifiedTo.setUTCHours(23, 59, 59, 999);

      if (modifiedFrom > modifiedTo) {
        throw new BadRequestException('Wrong date params');
      }

      modifiedPrevTo = dateFns.addDays(modifiedFrom, -1);
      modifiedPrevFrom = dateFns.addDays(modifiedPrevTo, daysDiff);
      modifiedPrevFrom.setUTCHours(0, 0, 0, 0);
      modifiedPrevTo.setUTCHours(23, 59, 59, 999);
    }
    const country: ReportCountriesEnum = this.reportManager.countryCodeToCountryEnum(countryParam);
    if (loadFromDb) {
      await this.reportSender.loadFromDbAndSendToEmailVolumeReport(
        {
          country,
          dateFrom: modifiedFrom,
          dateTo: modifiedTo,
          previousDateFrom: modifiedPrevFrom,
          previousDateTo: modifiedPrevTo,
        }
      );
    } else {
      await this.reportSender.generateAndSendToEmailVolumeReport(modifiedFrom, modifiedTo, country);
    }
  }
}
