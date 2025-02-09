import { Controller } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { WidgetInstallationService } from '../services';
import { ApplicationInstalledDto } from '../dto';
import { ApplicationUninstalledDto } from '../dto/application-uninstalled.dto';

@Controller()
export class WidgetBusMessageController {
  constructor(
    private readonly widgetInstallationService: WidgetInstallationService,
  ) { }

  @MessagePattern({
    name: 'apps.rpc.readonly.widgets-install-onboarding-apps',
  })
  public async rpcInstallApps(
    body: {
      apps: string[];
      businessId: string;
    },
  ): Promise<boolean> {
    return this.widgetInstallationService.installApps(body);
  }

  
  @MessagePattern({
    name: 'apps.readonly.widgets-install-onboarding-apps',
  })
  public async installApps(
    body: {
      apps: string[];
      businessId: string;
    },
  ): Promise<void> {
    await this.widgetInstallationService.installApps(body);
  }

  @MessagePattern({
    name: 'apps.rpc.readonly.widgets-install-app',
  })
  public async onWidgetInstalledEvent(data: ApplicationInstalledDto): Promise<void> {
    await this.widgetInstallationService.handleApplicationInstalledEvent(data);
  }

  @MessagePattern({
    name: 'apps.rpc.readonly.widgets-uninstall-app',
  })
  public async onWidgetUninstalledEvent(data: ApplicationUninstalledDto): Promise<void> {
    await this.widgetInstallationService.handleApplicationUninstalledEvent(data);
  }

  @MessagePattern({
    name: 'app-registry.event.application.installed',
  })
  public async onApplicationInstalledEvent(data: ApplicationUninstalledDto): Promise<void> {
    await this.widgetInstallationService.handleApplicationInstalledEvent(data);
  }
}
