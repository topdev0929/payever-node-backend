import { RabbitMqClient, RabbitMqRPCClient, UserTokenInterface } from '@pe/nest-kit';
import { Logger, Injectable } from '@nestjs/common';
import { InstalledApp } from '../../models/interfaces/installed-app';
import { BusinessModel } from '../../models/business.model';
import { AppRegistryEventNameEnum, CommerceosEventNameEnum } from '../../environments/rabbitmq.enum';
import { OriginAppService } from '../../services/origin-app.service';
import { ActionAppInterface } from '../../onboarding/interfaces/action-app.interface';
import { BusinessService } from '../../business/services';
import { OriginApp } from '../../models/interfaces/origin-app';

@Injectable()
export class AppsEventsProducer {
  constructor(
    private readonly rabbitClient: RabbitMqClient,
    private readonly rabbitMqRPCClient: RabbitMqRPCClient,
    private readonly originAppService: OriginAppService,
    private readonly businessService: BusinessService,
    private readonly logger: Logger,
  ) { }

  public async produceAppInstalledEvent(app: InstalledApp, business: BusinessModel): Promise<void> {
    await this.rabbitClient.send(
      {
        channel: AppRegistryEventNameEnum.ApplicationInstalled,
        exchange: 'async_events',
      },
      {
        name: AppRegistryEventNameEnum.ApplicationInstalled,
        payload: {
          businessId: business._id,
          code: app.code,
        },
      },
    );

    await this.rabbitClient.send(
      {
        channel: CommerceosEventNameEnum.ApplicationInstalled,
        exchange: 'async_events',
      },
      {
        name: CommerceosEventNameEnum.ApplicationInstalled,
        payload: {
          businessId: business._id,
          code: app.code,
        },
      },
    );
  }

  public async installAppsAndGetOnboardingStatus(
    apps: ActionAppInterface[],
    businessId: string,
    userId: string,
    rpc: boolean = true,
  ): Promise<any> {
    const payload: any = {
      apps: await this.filterAppsByOrigin(apps, businessId),
      businessId,
      userId,
    };

    if (rpc) {
      await this.sendRPCCall(
        payload,
        `apps.rpc.readonly.auth-install-onboarding-apps`,
      );
  
      await this.sendRPCCall(
        payload,
        `apps.rpc.readonly.widgets-install-onboarding-apps`,
      );
    } else {
      await this.rabbitClient.send(
        {
          channel: `apps.readonly.widgets-install-onboarding-apps`,
          exchange: 'async_events',
        },
        {
          name: `apps.readonly.widgets-install-onboarding-apps`,
          payload,
        },
      );

      await this.rabbitClient.send(
        {
          channel: `apps.readonly.auth-install-onboarding-apps`,
          exchange: 'async_events',
        },
        {
          name: `apps.readonly.auth-install-onboarding-apps`,
          payload,
        },
      );
    }
    
  }

  public async installApp(
    app: string,
    businessId: string,
    userToken?: UserTokenInterface,
  ): Promise<any> {
    const payload: any = {
      businessId,
      code: app,
      userId: userToken?.id,
    };

    await this.sendRPCCall(
      payload,
      `apps.rpc.readonly.auth-install-app`,
    );

    await this.sendRPCCall(
      payload,
      `apps.rpc.readonly.widgets-install-app`,
    );
  }

  public async uninstallApp(
    app: string,
    businessId: string,
    userToken?: UserTokenInterface,
  ): Promise<any> {
    const payload: any = {
      businessId,
      code: app,
      userId: userToken?.id,
    };

    await this.sendRPCCall(
      payload,
      `apps.rpc.readonly.auth-uninstall-app`,
    );

    await this.sendRPCCall(
      payload,
      `apps.rpc.readonly.widgets-uninstall-app`,
    );
  }

  public async produceAppUninstalledEvent(app: InstalledApp, business: BusinessModel): Promise<void> {
    await this.rabbitClient.send(
      {
        channel: AppRegistryEventNameEnum.ApplicationUnInstalled,
        exchange: 'async_events',
      },
      {
        name: AppRegistryEventNameEnum.ApplicationUnInstalled,
        payload: {
          businessId: business._id,
          code: app.code,
        },
      },
    );

    await this.rabbitClient.send(
      {
        channel: CommerceosEventNameEnum.ApplicationUninstalled,
        exchange: 'async_events',
      },
      {
        name: CommerceosEventNameEnum.ApplicationUninstalled,
        payload: {
          businessId: business._id,
          code: app.code,
        },
      },
    );
  }

  private async sendRPCCall(payload: any, eventName: string): Promise<void> {
    await this.rabbitMqRPCClient.send(
      {
        channel: eventName,
        exchange: 'async_events',
      },
      {
        name: eventName,
        payload,
      },
      {
        responseType: 'json',
      },
    ).catch((error: any) => {
      this.logger.error(
        {
          data: payload,
          error: error.message,
          message: 'Failed apps RPC call',
          routingKey: eventName,
        },
        error.stack,
        'AppsEventsProducer',
      );
    });
  }

  private async filterAppsByOrigin(apps: ActionAppInterface[], businessId: string): Promise<string[]> {
    const originApps: string[] | null = await this.originAppService.findAppIdsByBusiness(businessId);

    if (originApps) {
      apps = apps.filter((app: ActionAppInterface) => originApps.includes(app.app));
    }

    return apps.map((app: ActionAppInterface) => app.code);
  }
}
