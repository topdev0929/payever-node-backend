import { BadRequestException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import {
  AccessTokenPayload,
  AclInterface,
  PermissionInterface,
  RolesEnum,
  UserRoleMerchant,
  UserTokenInterface,
} from '@pe/nest-kit';
import { FilterQuery, Model, Query, Types } from 'mongoose';

import { BusinessService, NotifierService } from '../../business/services';
import { BusinessModel } from '../../models/business.model';
import { InstalledApp, InstalledAppPopulatedApp } from '../../models/interfaces/installed-app';
import { RegisteredApp } from '../interfaces/registered-app';
import { AppsEventsProducer } from '../producers';
import { ToggleDisallowedDto, ToggleInstallDto } from '../dto';
import { DashboardAppModel } from '../../models/dashboard-app.model';
import { UuidDocument } from '../../models/interfaces/uuid-document';
import { DefaultAppIds } from '../../environments';
import { OriginAppService } from '../../services/origin-app.service';

@Injectable()
export class BusinessAppsService {
  constructor(
    @InjectModel('Business') private readonly businessModel: Model<BusinessModel>,
    @InjectModel('DashboardApps') private readonly dashboardAppModel: Model<DashboardAppModel>,
    private readonly businessService: BusinessService,
    private readonly appsEventsProducer: AppsEventsProducer,
    private readonly notifier: NotifierService,
    private readonly originAppsService: OriginAppService,
  ) { }

  public async getInstalled(businessId: string, user: AccessTokenPayload): Promise<RegisteredApp[]> {
    const data: RegisteredApp[] = await this.get(businessId, user);

    return data.filter((app: RegisteredApp): boolean => {
      if (!app) {
        return false;
      }

      return app.installed;
    });
  }

  public async get(businessId: string, user: AccessTokenPayload): Promise<RegisteredApp[]> {
    const businessPlain: BusinessModel = await this.businessService.findOneById(businessId);

    const registeredOrigin: string = businessPlain.registrationOrigin;

    await businessPlain.populate('installedApps.app').execPopulate();
    const business: Omit<BusinessModel, 'installedApps'> & {
      installedApps: InstalledAppPopulatedApp[];
    } = businessPlain as any;
    const disallowedApps: InstalledApp[] = business.disallowedApps;

    const installedAppsWithDashboardAppLink: InstalledAppPopulatedApp[] = business.installedApps
      .filter(app => !!app.app);

    const allowedAppCodes: string[] = [
      'settings',
      'pos',
      'products',
      'connect',
      'checkout',
      'transactions',
      'shop',
      'site',
    ];

    const allowedDashboardApps: DashboardAppModel[] = await this.dashboardAppModel.find(
      {
        $and: [
          {
            code: {
              $in: [
                ...allowedAppCodes,
              ],
            },
          },
          {
            code: {
              $nin: [
                ...(disallowedApps?.map(app => app?.code) ?? []),
                ...installedAppsWithDashboardAppLink?.map(app => app.app?.code),
              ],
            },
          },
        ],

      }
    ) ?? [];


    let registeredApps: RegisteredApp[] = installedAppsWithDashboardAppLink
      .map((params: { app: DashboardAppModel }) => RegisteredApp.parse(params))
      .filter((app: RegisteredApp) => app && !!app.code)
      .filter((app: RegisteredApp) => {
        return !disallowedApps
          // TODO: add `|| disallowedApp.app === app._id` condition
          || !disallowedApps.find((disallowedApp: InstalledApp) => disallowedApp.code === app.code);
      });

    for (const app of allowedDashboardApps) {
      registeredApps.push(RegisteredApp.parse({ app }));
    }

    registeredApps = await this.filterAppsByOrigin(registeredApps, registeredOrigin);

    if (user.hasRole(RolesEnum.admin) || user.hasRole(RolesEnum.organization)) {
      return registeredApps;
    }

    const merchantRole: undefined | UserRoleMerchant = user.getRole(RolesEnum.merchant);
    if (!merchantRole) {
      return [];
    }

    let permission: undefined | PermissionInterface;
    for (const _permission of merchantRole.permissions) {
      if (_permission.businessId === businessId) {
        permission = _permission;
      }
    }

    if (!permission || !permission.acls.length) {
      return registeredApps;
    }
    
    if (businessPlain.owner === user.id) {
      return registeredApps;
    }

    return registeredApps.filter((app: RegisteredApp): boolean =>
      permission.acls.some((acl: AclInterface): boolean => acl.microservice === app.code && acl.read),
    );
  }

  public async toggleInstalled(
    toggleInstallDto: ToggleInstallDto,
    businessId: string,
    microUuid: string,
    produceRMQEvent: boolean = true,
    userToken?: UserTokenInterface,
  ): Promise<void> {

    let business: BusinessModel = await this.businessService.getOrCreate(
      businessId,
      DefaultAppIds.Business,
      null,
      null,
    );

    if (business.registrationOrigin) {
      const isAvailableInOrigin: boolean = await this.originAppsService.isAppAvailableForOrigin(
        microUuid, business.registrationOrigin,
      );

      if (!isAvailableInOrigin) {
        throw new BadRequestException(`app is not available for "${business.registrationOrigin}"`);
      }
    }

    let app: InstalledApp = business.installedApps.find(
      (x: InstalledApp): boolean => x.app === microUuid,
    );

    if (!app) {
      app = business.installedApps.create({
        app: microUuid,
        code: toggleInstallDto.code,
        installed: toggleInstallDto.installed,
        setupStatus: toggleInstallDto.setupStatus,
      } as InstalledApp);
      business.installedApps.push(app);
    } else {
      app.installed = toggleInstallDto.installed;
      app.code = toggleInstallDto.code;
      if (toggleInstallDto.setupStatus) {
        app.setupStatus = toggleInstallDto.setupStatus;
      }
    }

    const dashboardApp: DashboardAppModel = await this.dashboardAppModel.findOne( { _id: microUuid } );

    app.code = app.code ? app.code : dashboardApp?.code;

    if (app.installed) {
      await this.notifier.notifyTakeTour(business, app.code);
    } else {
      await this.notifier.cancelTakeTourNotification(business, app.code);
    }

    business = await this.businessModel.findOneAndUpdate(
      {
        _id: businessId,
      },
      {
        $set: {
          installedApps: business.installedApps,
        },
      },
      {
        new: true,
      },
    );

    if (produceRMQEvent) {
      await this.sendInstallMessage(toggleInstallDto, app, business, userToken);
    }
  }

  private async sendInstallMessage(
    toggleInstallDto: ToggleInstallDto, app: InstalledApp, business: BusinessModel, userToken: UserTokenInterface
    ) {
    if (toggleInstallDto.installed) {
      await this.appsEventsProducer.installApp(app.code, business._id, userToken);
      await this.appsEventsProducer.produceAppInstalledEvent(app, business);
    } else {
      await this.appsEventsProducer.uninstallApp(app.code, business._id, userToken);
      await this.appsEventsProducer.produceAppUninstalledEvent(app, business);
    }
  }

  public async updateStatus(
    toggleInstallDto: ToggleInstallDto,
    businessId: string,
    microUuid: string,
  ): Promise<void> {

    const business: BusinessModel = await this.businessService.getOrCreate(
      businessId,
      DefaultAppIds.Business,
      null,
      null,
    );

    const app: InstalledApp = business.installedApps.find(
      (x: InstalledApp): boolean => x.app === microUuid,
    );

    if (!app) {
      throw new UnauthorizedException('App is not installed');
    } else {
      app.code = toggleInstallDto.code;
      if (toggleInstallDto.setupStatus) {
        app.setupStatus = toggleInstallDto.setupStatus;
      }
    }

    const dashboardApp: DashboardAppModel = await this.dashboardAppModel.findOne( { _id: microUuid } );

    app.code = app.code ? app.code : dashboardApp?.code;

    await this.businessModel.findOneAndUpdate(
      {
        _id: businessId,
      },
      {
        $set: {
          installedApps: business.installedApps,
        },
      },
      {
        new: true,
      },
    );
  }

  public async installOnboardingApps(
    toggleInstallDtos: ToggleInstallDto[],
    businessId: string,
  ): Promise<void> {
    const business: BusinessModel = await this.businessService.getOrCreate(
      businessId,
      DefaultAppIds.Business,
      null,
      null,
    );

    for (const toggleInstallDto of toggleInstallDtos) {
      const app: InstalledApp = business.installedApps.create({
        app: toggleInstallDto.microUuid,
        code: toggleInstallDto.code,
        installed: toggleInstallDto.installed,
        setupStatus: toggleInstallDto.setupStatus,
      } as InstalledApp);
      business.installedApps.push(app);
      this.notifier.notifyTakeTour(business, app.code).catch();
    }

    await this.businessModel.updateOne(
      {
        _id: businessId,
      },
      {
        $set: {
          installedApps: business.installedApps,
        },
      },
      {
        new: true,
      },
    );
  }

  public async toggleDisallowed(
    toggleDisallowedDto: ToggleDisallowedDto,
    businessId: string,
    microUuid: string,
  ): Promise<void> {
    let business: BusinessModel = await this.businessService.findOneById(businessId);
    business.disallowedApps =
      business.disallowedApps ?
        business.disallowedApps
        : [] as Types.DocumentArray<InstalledApp & UuidDocument>;

    let app: InstalledApp = business.disallowedApps.find(
      (x: InstalledApp): boolean => x.app === microUuid,
    );
    const wasAppInstalled: InstalledApp = business.disallowedApps.find(
      (x: InstalledApp): boolean => x.app === microUuid,
    );

    let produceEvent: boolean = false;
    if (!app) {
      app = {
        app: microUuid,
        code: toggleDisallowedDto.code,
        setupStatus: toggleDisallowedDto.setupStatus,
      } as InstalledApp;
      business.disallowedApps.push(app);

      if (wasAppInstalled && wasAppInstalled.installed) {
        wasAppInstalled.installed = false;
        app.code = app.code ? app.code : toggleDisallowedDto.code;
        await this.notifier.cancelTakeTourNotification(business, app.code);
        produceEvent = true;
      }
    } else {
      business.disallowedApps = business.disallowedApps.filter(
        (x: InstalledApp): boolean => x.app === microUuid,
      ) as any;
    }

    business = await this.businessModel.findOneAndUpdate(
      {
        _id: businessId,
      },
      {
        $set: {
          disallowedApps: business.disallowedApps,
          installedApps: business.installedApps,
        },
      },
      {
        new: true,
      },
    );

    if (produceEvent) {
      await this.appsEventsProducer.produceAppUninstalledEvent(wasAppInstalled, business);
    }
  }

  public async changeSetupStep(businessId: string, code: string, setupStep: string): Promise<void> {
    const business: BusinessModel = await this.businessService.getOrCreate(businessId, DefaultAppIds.Business);

    const app: InstalledApp = business.installedApps.find((x: InstalledApp): boolean => x.code === code);
    if (!app) {
      throw new NotFoundException('App id not found');
    }
    app.setupStep = setupStep;

    await this.businessModel.findOneAndUpdate(
      {
        _id: businessId,
      },
      {
        $set: {
          installedApps: business.installedApps,
        },
      },
    );
  }

  public getBusinessList(query: any, limit: number, skip: number): Promise<BusinessModel[]> {
    return this.businessModel
      .find(query)
      .limit(limit)
      .skip(skip)
      .exec();
  }

  public findAll(condition: FilterQuery<BusinessModel> = { }): Query<BusinessModel[], BusinessModel> {
    return this.businessModel.find(condition) as any;
  }

  public async findOneById(businessUuid: string): Promise<BusinessModel> {
    return this.businessModel.findOne({ _id: businessUuid });
  }

  private async filterAppsByOrigin(
    registeredApps: RegisteredApp[],
    registeredOrigin: string,
  ): Promise<RegisteredApp[]> {
    const originApps: string[] | null = await this.originAppsService.findAppIdsByOrigin(registeredOrigin);

    if (originApps) {
      return registeredApps.filter((app: RegisteredApp) => originApps.includes(app._id));
    }

    return registeredApps;
  }
}
