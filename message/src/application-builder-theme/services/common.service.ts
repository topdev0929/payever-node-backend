import { Injectable, NotFoundException } from '@nestjs/common';
import { AppWithAccessConfigDto } from '../dto';
import { AccessConfigModel } from '../models';
import { CompiledThemeService } from '@pe/builder-theme-kit/module/service';
import { AccessConfigService } from './access-config.service';

@Injectable()
export class CommonService {
  constructor(
    private readonly accessConfigService: AccessConfigService,
    private readonly compiledThemeService: CompiledThemeService,
  ) {
  }

  public async getAccessConfigByAppId(applicationId: string, live: boolean = false): Promise<AppWithAccessConfigDto> {
    const accessConfig: AccessConfigModel = await this.accessConfigService.getByAppIdOrCreate(applicationId);
    if (live && !accessConfig.isLive) {
      throw new NotFoundException('Application is not live yet');
    }

    await accessConfig.populate('application').execPopulate();
    const business: any = accessConfig.application?.business;
    if (business) {
      business.defaultLanguage = business.defaultLanguage || 'en';
    }

    return {
      ...accessConfig.application?.toObject(),
      accessConfig: accessConfig?.toObject(),
    };
  }

  public async getApplicationThemeByAppId(applicationId: string): Promise<any> {
    const accessConfig: AccessConfigModel = await this.accessConfigService.getByAppIdOrCreate(applicationId);

    return this.compiledThemeService.getShopThemeByApplicationId(accessConfig.application);
  }
}
