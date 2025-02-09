import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ApplicationSchemaName } from '../schemas';
import { Command, Option } from '@pe/nest-kit';

import { ApplicationModel } from '../models';
import { ApplicationThemeService } from '@pe/builder-kit/module/application-theme/services';
import { ThemeModel, ThemeService } from '@pe/builder-kit/module/themes';

@Injectable()
export class CreateDefaultThemeCommand {
  constructor(
    @InjectModel(ApplicationSchemaName) private readonly applicationModel: Model<ApplicationModel>,
    private readonly applicationThemeService: ApplicationThemeService,
    private readonly themeService: ThemeService,
  ) { }

  @Command({
    command: 'create:default:theme [--uuid]',
    describe: 'Create default theme for applications',
  })
  public async createDefaultTheme(
    @Option({
      name: 'uuid',
    })
    applicationId: string,
  ): Promise<void> {
    const criteria: any = { };

    if (applicationId) {
      criteria._id = applicationId;
    }

    const defaultTheme: ThemeModel = await this.themeService.findDefaultTheme();

    const count: number = await this.applicationModel.countDocuments(criteria).exec();
    Logger.log(`Found ${count} applications.`);

    const limit: number = 50;
    let start: number = 0;
    let applications: ApplicationModel[] = [];

    while (start < count) {
      applications = await this.getWithLimit(start, limit);
      Logger.log(`Processing next ${limit}...`);

      start += limit;

      for (const application of applications) {
        await this.applicationThemeService.createDefaultTheme(defaultTheme, application._id);
      }

      Logger.log(`Processed ${start - limit + applications.length} out of ${count}`);
    }
  }

  private async getWithLimit(start: number, limit: number): Promise<ApplicationModel[]> {
    return this.applicationModel.find(
      { },
      null,
      {
        limit: limit,
        skip: start,
      },
    );
  }
}
