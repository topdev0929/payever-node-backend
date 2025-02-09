import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { ApplicationModel } from '../models';
import { Model } from 'mongoose';
import { ApplicationSchemaName } from '../schemas';
import { CreateApplicationDto } from '../dtos';
import { ThemeModel, ThemeService } from '@pe/builder-kit/module/themes';
import {
  ApplicationService,
  ApplicationThemeService,
  InstantThemeInstallerService,
} from '@pe/builder-kit/module/application-theme/services';
import { ApplicationInterface, ApplicationThemeModel } from '@pe/builder-kit/module/application-theme/interfaces';
import { ShapeAlbumService, ShapeService } from '@pe/builder-kit/module/shape';
import { EventDispatcher } from '@pe/nest-kit';
import { environment } from '../../environments';
import { ApplicationEventsEnum } from '@pe/builder-kit/module/application-theme/enums';

@Injectable()
export class BuilderApplicationService {
  constructor(
    @InjectModel(ApplicationSchemaName) private readonly applicationModel: Model<ApplicationModel>,
    private readonly themeService: ThemeService,
    private readonly instantThemeInstallerService: InstantThemeInstallerService,
    private readonly applicationService: ApplicationService,
    private readonly applicationThemeService: ApplicationThemeService,
    private readonly shapeAlbumService: ShapeAlbumService,
    private readonly shapeService: ShapeService,
    private readonly eventDispatcher: EventDispatcher,
  ) { }

  public async create(
    dto: CreateApplicationDto,
  ): Promise<void> {
    const applicationModel: ApplicationModel = await this.upsert(dto);
    const application: ApplicationInterface = await this.applicationService.findById(dto.id);

    if (environment.generalConfig.autoInstallDefaultTheme.includes(environment.applicationType)) {
      const defaultTheme: ThemeModel = await this.themeService.findDefaultTheme();
      await this.instantThemeInstallerService.install(application, defaultTheme, true, true);
    }
  }

  public async removeById(applicationId: string): Promise<ApplicationModel> {
    await this.eventDispatcher.dispatch(ApplicationEventsEnum.ApplicationRemoved, applicationId);

    return this.applicationModel.findOneAndDelete({ _id: applicationId });
  }

  public async  upsertFromExport(dto: CreateApplicationDto): Promise<void> {
    const existing: ApplicationModel = await this.applicationModel.findById(dto.id).exec();
    if (!existing) { // need to trigger the auto create default steps
      await this.create(dto);
    }

    const application: ApplicationModel = await this.upsert(dto);
    await this.checkThemeInstalled(application);
  }

  public async upsert(dto: CreateApplicationDto): Promise<ApplicationModel> {
    const set: any = {
      business: dto.business.id as any,
    };

    if (dto.name) {
      set.name = dto.name;
    }

    if (dto.title) {
      set.title = dto.title;
    }

    if (dto.affiliate) {
      set.name = dto.affiliate.firstName;
      set.email = dto.affiliate.email;
    }

    return this.applicationModel.findOneAndUpdate(
      { _id: dto.id },
      {
        $set: set,
      },
      {
        new: true,
        setDefaultsOnInsert: true,
        upsert: true,
      },
    );
  }

  private async checkThemeInstalled(applicationModel: ApplicationModel): Promise<void> {
    const appTheme: ApplicationThemeModel =
      await this.applicationThemeService.findByApplicationId(applicationModel._id);
    if (!appTheme && environment.generalConfig.autoInstallDefaultTheme.includes(environment.applicationType)) {
      // todo: this get application interface is redundant, need to update n keep using ApplicationModel
      const application: ApplicationInterface = await this.applicationService.findById(applicationModel._id);
      const defaultTheme: ThemeModel = await this.themeService.findDefaultTheme();
      await this.instantThemeInstallerService.install(application, defaultTheme, true);
    }
  }
}
