import { Controller, Delete, HttpCode, HttpStatus, Post, UseGuards } from '@nestjs/common';
import { Acl, AclActionsEnum, JwtAuthGuard, ParamModel, Roles, RolesEnum } from '@pe/nest-kit';
import { ApiBearerAuth, ApiParam } from '@nestjs/swagger';
import { BusinessModel, BusinessSchemaName } from '@pe/business-kit';
import { AppModel, AppSubscriptionModel } from '../models';
import { AppSchemaName } from '../schemas';
import { AppSubscriptionService } from '../services';

@Controller('business/:businessId/apps/:appId')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
@Roles(RolesEnum.merchant)
export class AppSubscriptionsController {
  constructor(
    private readonly appSubscriptionService: AppSubscriptionService,
  ) { }

  @Post('install')
  @HttpCode(HttpStatus.OK)
  @ApiParam({ name: 'businessId' })
  @ApiParam({ name: 'appId' })
  @Acl({ microservice: 'apps', action: AclActionsEnum.create })
  public async install(
    @ParamModel(':businessId', BusinessSchemaName, true) business: BusinessModel,
    @ParamModel(':appId', AppSchemaName, true) app: AppModel,
  ): Promise<AppSubscriptionModel> {
    return this.appSubscriptionService.install(business, app);
  }

  @Delete('uninstall')
  @ApiParam({ name: 'businessId' })
  @ApiParam({ name: 'appId' })
  @Acl({ microservice: 'apps', action: AclActionsEnum.delete })
  public async uninstall(
    @ParamModel(':businessId', BusinessSchemaName, true) business: BusinessModel,
    @ParamModel(':appId', AppSchemaName, true) app: AppModel,
  ): Promise<AppSubscriptionModel> {
    return this.appSubscriptionService.uninstall(business, app);
  }
}
