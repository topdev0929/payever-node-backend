import { BadRequestException, Injectable } from '@nestjs/common';
import { Command, Option, Positional } from '@pe/nest-kit';
import { DateRangeService, VolumeReportManager } from '../services';
import { ReportTypesEnum } from '../enums/report-types.enum';
import { ReportCountriesEnum } from '../enums';

@Injectable()
export class SaveReportToDbCommand {
  constructor(
    private readonly volumeReportManager: VolumeReportManager,
  ) { }

  @Command({
    command: 'report:save:db [--type] [--from] [--to] [--country]',
    describe: 'Create and save report by type',
  })
  public async saveReportToDb(
    @Positional({ name: 'type' }) type?: ReportTypesEnum,
    @Option({ name: 'country' }) countryParam?: string,
    @Option({ name: 'from' }) dateFrom?: string,
    @Option({ name: 'to' }) dateTo?: string,
  ): Promise<void> {
    if (!type || !Object.values(ReportTypesEnum).includes(type)) {
      throw new BadRequestException('Wrong "type" param');
    }

    let modifiedFrom: Date = DateRangeService.getPrevDay(true);
    let modifiedTo: Date = DateRangeService.getPrevDay(false);

    if (dateFrom && dateTo) {
      modifiedFrom = new Date(dateFrom);
      modifiedFrom.setUTCHours(0, 0, 0, 0);

      modifiedTo = new Date(dateTo);
      modifiedTo.setUTCHours(23, 59, 59, 999);

      if (modifiedFrom > modifiedTo) {
        throw new BadRequestException('Wrong "date" params');
      }
    }
    const country: ReportCountriesEnum = this.volumeReportManager.countryCodeToCountryEnum(countryParam);

    await this.volumeReportManager.generateAndSaveReportToDbByType(
      type, country, modifiedFrom, modifiedTo
    );
  }
}
