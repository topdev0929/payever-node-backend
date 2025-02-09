import { Controller, HttpStatus, Put, Get, UseGuards } from '@nestjs/common';
import { ApiTags, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard, Roles, RolesEnum, Acl, AclActionsEnum } from '@pe/nest-kit/modules/auth';
import { BusinessLocalModel } from '../../business/models';
import { BusinessLocalService } from '../../business/services';
import { IntegrationSubscriptionService } from '../services';
import { ParamModel } from '@pe/nest-kit';
import { BusinessSchemaName } from '../../business/schemas';
import { IntegrationSubscriptionSchemaName } from '../schemas';
import { IntegrationSubscriptionModel } from '../models';

export const SUBSCRIPTION_ID: string = ':subscriptionId';
@Controller('business/:businessId/integration-subscriptions')
@UseGuards(JwtAuthGuard)
@ApiTags('Business Integration Subscriptions')
@ApiBearerAuth()
@Roles(RolesEnum.merchant)
@ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Invalid authorization token.' })
@ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Unauthorized.' })
export class IntegrationSubscriptionController {
  constructor(
    private readonly businessService: BusinessLocalService,
    private readonly integrationSubscriptionService: IntegrationSubscriptionService,
  ) { }

  @Get()
  @Acl({ microservice: 'social', action: AclActionsEnum.read })
  public async getBusiness(
    @ParamModel(':businessId', BusinessSchemaName) business: BusinessLocalModel,
  ): Promise<BusinessLocalModel> {
    await this.businessService.populateIntegrations(business);

    return business;
  }

  @Put(':subscriptionId/switch-on')
  @Acl(
    { microservice: 'social', action: AclActionsEnum.update },
    { microservice: 'connect', action: AclActionsEnum.update },
  )
  public async switchOn(
    @ParamModel(':businessId', BusinessSchemaName) business: BusinessLocalModel,
    @ParamModel(SUBSCRIPTION_ID, IntegrationSubscriptionSchemaName) subscription: IntegrationSubscriptionModel,
  ): Promise<BusinessLocalModel> {
    await this.integrationSubscriptionService.enable(subscription, business);
    await this.businessService.populateIntegrations(business);

    return business;
  }

  @Put(':subscriptionId/switch-off')
  @Acl(
    { microservice: 'social', action: AclActionsEnum.update },
    { microservice: 'connect', action: AclActionsEnum.update },
  )
  public async switchOff(
    @ParamModel(':businessId', BusinessSchemaName) business: BusinessLocalModel,
    @ParamModel(SUBSCRIPTION_ID, IntegrationSubscriptionSchemaName) subscription: IntegrationSubscriptionModel,
  ): Promise<BusinessLocalModel> {
    await this.integrationSubscriptionService.disable(subscription);
    await this.businessService.populateIntegrations(business);

    return business;
  }
}
