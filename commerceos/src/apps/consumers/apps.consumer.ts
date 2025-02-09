import { Controller } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';

import { RpcOnboardingAppsDto } from '../dto';
import { OnboardingAppsItemDto } from '../dto/onboarding/onboarding-apps-item.dto';
import { BusinessAppsService } from '../services/business.apps.service';
import { AppsEventsProducer } from '../producers';
import { OnboardingManager } from '../../onboarding/services';
import { OnboardingDto } from '../../onboarding/dto';

@Controller()
export class AppsConsumer {
  constructor(
    private readonly businessAppsService: BusinessAppsService,
    private readonly appsEventsProducer: AppsEventsProducer,
    private readonly onboardingManager: OnboardingManager,
  ) { }

  @MessagePattern({
    name: 'apps.rpc.apps.install-onboarding-apps',
  })
  public async installOnboardingApps(onboardingAppsDto: RpcOnboardingAppsDto): Promise<void> {
    await this.businessAppsService.installOnboardingApps(
      onboardingAppsDto.apps.map(
        (app: OnboardingAppsItemDto) => {
          return {
            code: app.code,
            installed: app.installed,
            microUuid: app.app,
            setupStatus: app.setupStatus,
          };
        },
      ),
      onboardingAppsDto.businessId,
    );

    await this.appsEventsProducer.installAppsAndGetOnboardingStatus(
      onboardingAppsDto.apps,
      onboardingAppsDto.businessId,
      onboardingAppsDto.userId,
    );
  }

  @MessagePattern({
    name: 'onboarding.event.setup.apps',
  })
  public async setupApps(data: {
    businessId: string;
    userId: string;
    onboardingName: string;
  }): Promise<void> {

    const { businessId, userId, onboardingName }: any = data;
    const businessOnboardingSteps: OnboardingDto = await this.onboardingManager.getCachedOnboarding(
      { name: onboardingName },
    );
    const onboardingAppsDto: any = businessOnboardingSteps.afterRegistration[0].payload;

    await this.businessAppsService.installOnboardingApps(
      onboardingAppsDto.apps.map(
        (app: OnboardingAppsItemDto) => {
          return {
            code: app.code,
            installed: app.installed,
            microUuid: app.app,
            setupStatus: app.setupStatus,
          };
        },
      ),
      businessId,
    );
    await this.appsEventsProducer.installAppsAndGetOnboardingStatus(onboardingAppsDto.apps, businessId, userId, false);
  }
}
