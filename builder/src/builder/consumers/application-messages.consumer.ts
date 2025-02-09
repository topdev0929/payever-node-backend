import { Controller, NotAcceptableException } from '@nestjs/common';
import { ApplicationMessageEnum } from '../enums';
import { BuilderApplicationService } from '../services';
import { CreateApplicationDto, RemoveApplicationDto, RequestPublishThemeDto } from '../dtos';
import { ApplicationQueuePattern } from '../decorators';
import { ApplicationThemeService, ThemePublisherService } from '@pe/builder-kit/module/application-theme/services';
import { ThemeModel, ThemeService, ThemeVersionModel, ThemeVersionService } from '@pe/builder-kit/module/themes';
import { ApplicationThemeModel } from '@pe/builder-kit/module/application-theme/interfaces';
import { environment } from '../../environments';
import { ApplicationTypesEnum } from '@pe/builder-kit/module/common/enums';

@Controller()
export class ApplicationMessagesConsumer {
  constructor(
    private readonly themeService: ThemeService,
    private readonly themeVersionService: ThemeVersionService,
    private readonly appThemeService: ApplicationThemeService,
    private readonly applicationService: BuilderApplicationService,
    private readonly themePublisher: ThemePublisherService,
  ) { }

  @ApplicationQueuePattern({
    name: ApplicationMessageEnum.ApplicationCreated,
  })
  public async onApplicationCreateEvent(dto: CreateApplicationDto): Promise<void> {
    if (environment.applicationType === ApplicationTypesEnum.Invoice) {
      return;
    }
    await this.applicationService.create(dto);
  }

  @ApplicationQueuePattern({
    name: ApplicationMessageEnum.ApplicationRemoved,
  })
  public async onApplicationRemoveEvent(dto: RemoveApplicationDto): Promise<void> {
    if (environment.applicationType === ApplicationTypesEnum.Invoice) {
      return;
    }
    await this.applicationService.removeById(dto.id);
  }

  @ApplicationQueuePattern({
    name: ApplicationMessageEnum.ApplicationUpdated,
  })
  public async onApplicationUpdateEvent(dto: CreateApplicationDto): Promise<void> {
    if (environment.applicationType === ApplicationTypesEnum.Invoice) {
      return;
    }
    await this.applicationService.upsert(dto);
  }

  @ApplicationQueuePattern({
    name: ApplicationMessageEnum.ApplicationExported,
  })
  public async onApplicationExportEvent(dto: CreateApplicationDto): Promise<void> {
    if (environment.applicationType === ApplicationTypesEnum.Invoice) {
      return;
    }
    await this.applicationService.upsertFromExport(dto);
  }

  @ApplicationQueuePattern({
    name: 'request.publish.theme',
  })
  public async onRequestPublishTheme(dto: RequestPublishThemeDto): Promise<void> {
    const theme: ThemeModel = await this.themeService.findById(dto.theme);
    await theme.populate('versions').execPopulate();
    const newVersionName: string = this.themeVersionService.getNextVersionNumberFromVersions(theme.versions);
    const version: ThemeVersionModel = await this.themeVersionService.createVersion(theme, {
      name: newVersionName,
    });

    const appTheme: ApplicationThemeModel = await this.appThemeService.findByThemeWithApplication(theme);
    if (!appTheme) {
      throw new NotAcceptableException(
        `Theme "${theme.id}" can't be published. It is not tied to any application`,
      );
    }

    await version
      .populate('snapshot')
      .populate('theme')
      .execPopulate();

    await appTheme
      .populate('theme')
      .execPopulate();

    return this.themePublisher.publish(appTheme.application, appTheme, version);
  }
}
