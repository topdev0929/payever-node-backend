import { BusinessMessagesHooksEnum, BusinessDto } from '@pe/business-kit';
import { Injectable } from '@nestjs/common';
import { EventListener } from '@pe/nest-kit';
import { ApplicationTypesEnum } from '@pe/builder-kit/module/common/enums';
import { BuilderApplicationService } from '../services';
import { environment } from '../../environments';
import { ShapeService } from '@pe/builder-kit/module/shape';
import { ApplicationThemeService } from '@pe/builder-kit/module/application-theme/services';
import { ThemeService } from '@pe/builder-kit/module/themes';

@Injectable()
export class BusinessEventsListener {
  constructor(
    private readonly builderApplicationService: BuilderApplicationService,
  ) { }

  @EventListener(BusinessMessagesHooksEnum.BusinessPreCreatedHook)
  public async onBusinessCreated(business: BusinessDto): Promise<void> {
    if (environment.applicationType === ApplicationTypesEnum.Invoice) {
      await this.builderApplicationService.create({
        business: {
          id: business._id,
        },
        id: business._id,
        title: business.name,
      } as any);
    }
  }

  @EventListener(BusinessMessagesHooksEnum.BusinessPreExportHook)
  public async onBusinessExported(business: BusinessDto): Promise<void> {
    if (environment.applicationType === ApplicationTypesEnum.Invoice) {
      await this.builderApplicationService.upsert({
        business: {
          id: business._id,
        },
        id: business._id,
        title: business.name,
      } as any);
    }
  }
}
