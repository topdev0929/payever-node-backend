import { Body, Controller, Get, HttpCode, HttpStatus, Param, Patch, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';
import {
  AccessTokenPayload,
  Acl,
  AclActionsEnum,
  JwtAuthGuard,
  Roles,
  RolesEnum,
  User,
  UserTokenInterface,
} from '@pe/nest-kit/modules/auth';
import { ChangeSetupStepDto, GetAppDto, ToggleInstallDto, OnboardingAppsDto } from '../dto';
import { BusinessAppsService } from '../services/business.apps.service';
import { RegisteredApp } from '../interfaces/registered-app';
import { MinRegisteredApp } from '../interfaces/min-registered-app';
import { RegisteredAppAcls } from '../interfaces/registered-app-acls';
import { AppsEventsProducer } from '../producers';
import { OnboardingAppsItemDto } from '../dto/onboarding/onboarding-apps-item.dto';
import { RedisClient } from '@pe/nest-kit';

@Controller('apps/business/:businessId')
@ApiTags('business apps')
@UseGuards(JwtAuthGuard)
@Roles(RolesEnum.merchant)
@ApiBearerAuth()
export class BusinessAppsController {
  constructor(
    private readonly businessAppsService: BusinessAppsService,
    private readonly appsEventsProducer: AppsEventsProducer,
    private readonly redisClient: RedisClient,
  ) { }

  @Get('')
  @HttpCode(HttpStatus.OK)
  @ApiResponse({
    description: 'The apps have been successfully fetched.',
    isArray: true,
    status: HttpStatus.OK,
    type: GetAppDto,
  })
  @Acl({ microservice: 'commerceos', action: AclActionsEnum.read })
  public async getApps(
    @User() user: AccessTokenPayload,
    @Param('businessId') businessId: string,
  ): Promise<MinRegisteredApp[]> {
    let data: RegisteredApp[] = await this.businessAppsService.get(businessId, user);

    // filter null
    data = data.filter((app: RegisteredApp) => app);

    data = data.filter(
      (
        thing: RegisteredApp,
        index: number,
        self: RegisteredApp[],
      ) => index === self.findIndex((t: RegisteredApp) => t.code === thing.code),
    );

    return data.map((app: RegisteredApp) => {
      return {
        _id: app._id,
        appName: `commerceos.${app.code}.app.name`,
        bootstrapScriptUrl: app.bootstrapScriptUrl,
        businessTypes: app.businessTypes,
        code: app.code,
        dashboardInfo: app.dashboardInfo,
        default: app.default,
        installed: app.installed,
        setupStatus: app.setupStatus,
        tag: app.tag,
      };
    });
  }

  @Get('acls')
  @HttpCode(HttpStatus.OK)
  @ApiResponse({
    description: 'The apps have been successfully fetched.',
    isArray: true,
    status: HttpStatus.OK,
    type: GetAppDto,
  })
  @Acl({ microservice: 'commerceos', action: AclActionsEnum.read })
  public async getAppsAcls(
    @User() user: AccessTokenPayload,
    @Param('businessId') businessId: string,
  ): Promise<RegisteredAppAcls[]> {
    let data: RegisteredApp[] = await this.businessAppsService.get(businessId, user);

    // filter null
    data = data.filter((app: RegisteredApp) => app);

    data = data.filter(
      (
        thing: RegisteredApp,
        index: number,
        self: RegisteredApp[],
      ) => index === self.findIndex((t: RegisteredApp) => t.code === thing.code),
    );

    return data.map((app: RegisteredApp) => {
      return {
        _id: app._id,
        allowedAcls: app.allowedAcls,
        code: app.code,
        dashboardInfo: app.dashboardInfo,
      };
    });
  }

  @Get('dashboard')
  @HttpCode(HttpStatus.OK)
  @ApiResponse({
    description: 'The apps have been successfully fetched.',
    isArray: true,
    status: HttpStatus.OK,
    type: GetAppDto,
  })
  @Acl({ microservice: 'commerceos', action: AclActionsEnum.read })
  public async getAppsDashboard (
    @User() user: AccessTokenPayload,
    @Param('businessId') businessId: string,
  ): Promise<MinRegisteredApp[]> {
    const data: RegisteredApp[] = await this.businessAppsService.getInstalled(businessId, user);

    /* tslint:disable:no-identical-functions */
    return data.map((app: RegisteredApp) => {
      return {
        _id: app._id,
        appName: `commerceos.${app.code}.app.name`,
        bootstrapScriptUrl: app.bootstrapScriptUrl,
        code: app.code,
        dashboardInfo: app.dashboardInfo,
        default: app.default,
        installed: app.installed,
        setupStatus: app.setupStatus,
        tag: app.tag,
      };
    }).filter((app:  RegisteredApp) => {
      return !!(app.dashboardInfo && Object.keys(app.dashboardInfo).length > 0);
    });
  }

  @Patch('toggle-installed')
  @HttpCode(HttpStatus.CREATED)
  @ApiResponse({
    description: 'The installed state has been successfully changed.',
    status: HttpStatus.CREATED,
  })
  @Acl({ microservice: 'commerceos', action: AclActionsEnum.update })
  public async installOnboardingApps(
    @User() user: AccessTokenPayload,
    @Param('businessId') businessId: string,
    @Body() onboardingAppsDto: OnboardingAppsDto,
  ): Promise<void> {
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
    await this.appsEventsProducer.installAppsAndGetOnboardingStatus(onboardingAppsDto.apps, businessId, user.id);
  }

  @Patch('toggle-installed/:microUuid')
  @HttpCode(HttpStatus.CREATED)
  @ApiResponse({
    description: 'The installed state has been successfully changed.',
    status: HttpStatus.CREATED,
  })
  @Acl({ microservice: 'commerceos', action: AclActionsEnum.update })
  public async toggleInstalled(
    @Param('businessId') businessId: string,
    @Param('microUuid') microUuid: string,
    @Body() toggleInstallDto: ToggleInstallDto,
    @User() userToken: UserTokenInterface,
  ): Promise<void> {
    return this.businessAppsService.toggleInstalled(toggleInstallDto, businessId, microUuid, true, userToken);
  }

  @Patch('update-status/:microUuid')
  @HttpCode(HttpStatus.CREATED)
  @ApiResponse({
    description: 'The installed state has been successfully changed.',
    status: HttpStatus.CREATED,
  })
  @Acl({ microservice: 'commerceos', action: AclActionsEnum.update })
  public async updateStatus(
    @Param('businessId') businessId: string,
    @Param('microUuid') microUuid: string,
    @Body() toggleInstallDto: ToggleInstallDto,
  ): Promise<void> {
    return this.businessAppsService.updateStatus(toggleInstallDto, businessId, microUuid);
  }

  @Patch('app/:code/change-setup-step')
  @Acl({ microservice: 'commerceos', action: AclActionsEnum.update })
  @HttpCode(HttpStatus.CREATED)
  @ApiResponse({
    description: 'The setup step has been successfully changed.',
    status: HttpStatus.CREATED,
  })
  public changeSetupStep(
    @Param('businessId') businessId: string,
    @Param('code') code: string,
    @Body() toggleSetupStepDto: ChangeSetupStepDto,
  ): Promise<void> {
    return this.businessAppsService.changeSetupStep(businessId, code, toggleSetupStepDto.setupStep);
  }
}
