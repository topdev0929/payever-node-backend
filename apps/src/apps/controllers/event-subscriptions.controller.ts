import { Controller, Patch, Body, UseGuards } from '@nestjs/common';
import { JwtAuthGuard, Roles, RolesEnum, ParamModel, Acl, AclActionsEnum } from '@pe/nest-kit';
import { ApiBearerAuth, ApiParam } from '@nestjs/swagger';

import { BusinessSchemaName, BusinessModel } from '@pe/business-kit';
import { EventSubscriptionDto } from '../dto';
import { AppModel, EventSubscriptionModel } from '../models';
import { AppSchemaName } from '../schemas';
import { EventSubscriptionService } from '../services';

@Controller('business/:businessId/apps/:appId/subscription')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
@Roles(RolesEnum.merchant)
export class EventSubscriptionsController {
  constructor(
    private readonly eventSubscriptionService: EventSubscriptionService,
  ) { }

  @Patch()
  @ApiParam({ name: 'businessId' })
  @ApiParam({ name: 'appId' })
  @Acl({ microservice: 'apps', action: AclActionsEnum.update })
  public async updateEventSubscription(
    @ParamModel(':businessId', BusinessSchemaName, true) business: BusinessModel,
    @ParamModel(':appId', AppSchemaName, true) app: AppModel,
    @Body() dto: EventSubscriptionDto,
  ): Promise<EventSubscriptionModel> {
    return this.eventSubscriptionService.updateEventSubscription(business, app, dto);
  }
}
