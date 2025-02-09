import {
  Controller,
  Get,
  Patch,
  Param,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiTags,
} from '@nestjs/swagger';
import {
  Roles,
  RolesEnum,
  ParamModel,
  JwtAuthGuard,
  AclActionsEnum,
  Acl,
} from '@pe/nest-kit';


import { BUSINESS_ID_NON_GUARDED_PLACEHOLDER_C, BUSINESS_ID_PLACEHOLDER } from './const';
import { SubscriptionService } from '../../projections/services';
import { SubscriptionDocument } from '../../projections/models';
import { BusinessSchemaName, BusinessModel } from '@pe/business-kit';

@Controller(`business/${BUSINESS_ID_NON_GUARDED_PLACEHOLDER_C}/subscriptions`)
@ApiTags('subscriptions')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
@Roles(RolesEnum.admin, RolesEnum.merchant)
export class SubscriptionsController {
  constructor(
    private readonly subscriptionsService: SubscriptionService,
  ) { }

  @Get()
  @Acl({ microservice: 'message', action: AclActionsEnum.read })
  public async read(
    @ParamModel(BUSINESS_ID_NON_GUARDED_PLACEHOLDER_C, BusinessSchemaName) business: BusinessModel,
    @Param(BUSINESS_ID_PLACEHOLDER) swaggerBusinessId: string,
  ): Promise<SubscriptionDocument[]> {
    return this.subscriptionsService.find({
      business: business._id,
    }).populate({
      path: 'integration',
    });
  }

  @Get('all')
  @Acl({ microservice: 'message', action: AclActionsEnum.read })
  public async all(
    @ParamModel(BUSINESS_ID_NON_GUARDED_PLACEHOLDER_C, BusinessSchemaName) business: BusinessModel,
    @Param(BUSINESS_ID_PLACEHOLDER) swaggerBusinessId: string,
  ): Promise<any[]> {
    return this.subscriptionsService.getAll(business._id);
  }

  @Patch('/:integrationName/install')
  @Acl({ microservice: 'message', action: AclActionsEnum.create })
  public async install(
    @ParamModel(BUSINESS_ID_NON_GUARDED_PLACEHOLDER_C, BusinessSchemaName) business: BusinessModel,
    @Param(BUSINESS_ID_PLACEHOLDER) swaggerBusinessId: string,
    @Param('integrationName') integrationName: string,
  ): Promise<SubscriptionDocument> {
    const subscription: SubscriptionDocument =
      await this.subscriptionsService.getSubscriptionByIntegrationCodeAndBusinessId({
        businessId: business._id,
        code: integrationName,
      });
    if (!subscription.enabled) {
      await this.subscriptionsService.enable(subscription);
    }

    return subscription;
  }

  @Patch('/:integrationName/uninstall')
  @Acl({ microservice: 'message', action: AclActionsEnum.update })
  public async uninstall(
    @ParamModel(BUSINESS_ID_NON_GUARDED_PLACEHOLDER_C, BusinessSchemaName) business: BusinessModel,
    @Param(BUSINESS_ID_PLACEHOLDER) swaggerBusinessId: string,
    @Param('integrationName') integrationName: string,
  ): Promise<SubscriptionDocument> {
    const subscription: SubscriptionDocument =
      await this.subscriptionsService.getSubscriptionByIntegrationCodeAndBusinessId({
        businessId: business._id,
        code: integrationName,
      });
    if (subscription.enabled) {
      await this.subscriptionsService.disable(subscription);
    }

    return subscription;
  }
}
