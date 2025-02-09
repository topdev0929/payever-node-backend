import { Controller, Logger } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { AppInstalledDto } from '../dto/app-installation';
import { BusinessAppInstallationService } from '../services';

@Controller()
export class CommerceosConsumer {
  constructor(
    private readonly logger: Logger,
    private readonly businessAppInstallationService: BusinessAppInstallationService,
  ) { }

  @MessagePattern({
    name: 'app-registry.event.application.installed',
  })
  public async onAppInstalled(appInstalledDto: AppInstalledDto): Promise<void> {
    await this.businessAppInstallationService.save(appInstalledDto.businessId, appInstalledDto.code);
    this.logger.log(`App "${appInstalledDto.code}" installed for business "${appInstalledDto.businessId}"`);
  }

  @MessagePattern({
    name: 'app-registry.event.application.uninstalled',
  })
  public async onAppUnInstalled(appInstalledDto: AppInstalledDto): Promise<void> {
    await this.businessAppInstallationService.remove(appInstalledDto.businessId, appInstalledDto.code);
    this.logger.log(`App "${appInstalledDto.code}" uninstalled for business "${appInstalledDto.businessId}"`);
  }
}
