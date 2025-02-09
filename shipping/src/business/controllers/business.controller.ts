import { Controller, Get, HttpStatus, UseGuards } from '@nestjs/common';
import { ApiTags, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard, Roles, RolesEnum, AclActionsEnum, Acl } from '@pe/nest-kit/modules/auth';
import { BusinessModel } from '../models';
import { BusinessServiceLocal } from '../services';
import { ParamModel } from '@pe/nest-kit';
import { BusinessSchemaName } from '../schemas';
import { IntegrationService, IntegrationSubscriptionService } from '../../integration/services';
import { IntegrationModel, IntegrationSubscriptionModel } from '../../integration/models';
import { IntegrationSchemaName } from '../../integration/schemas';
import { IntegrationSubscriptionInterface } from '../../integration/interfaces';

@Controller('business/:businessId')
@UseGuards(JwtAuthGuard)
@ApiTags('Business Shipping')
@ApiBearerAuth()
@Roles(RolesEnum.merchant)
@ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Invalid authorization token.'})
@ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Unauthorized.'})
export class BusinessController {
  constructor(
    private readonly businessServiceLocal: BusinessServiceLocal,
    private readonly integrationService: IntegrationService,
    private readonly integrationSubscriptionService: IntegrationSubscriptionService,
    ) { }

  @Get()
  @Acl({ microservice: 'shipping', action: AclActionsEnum.read })
  public async getBusiness(
    @ParamModel(':businessId', BusinessSchemaName) business: BusinessModel,
  ): Promise<BusinessModel> {
    await this.businessServiceLocal.populateIntegrations(business, true);

    return business;
  }

  @Get('methods')
  @Acl({ microservice: 'shipping', action: AclActionsEnum.read })
  public async getBusinessShippingMethods(
    @ParamModel(':businessId', BusinessSchemaName) business: BusinessModel,
  ): Promise<IntegrationSubscriptionModel[]> {
    await this.businessServiceLocal.populateIntegrations(business);

    return business.integrationSubscriptions
      .filter((s: IntegrationSubscriptionInterface) => s.installed && s.enabled);
  }

  @Get('custom')
  @Acl({ microservice: 'shipping', action: AclActionsEnum.read })
  public async getBusinessCustomIntegration(
    @ParamModel(':businessId', BusinessSchemaName) business: BusinessModel,
  ): Promise<IntegrationSubscriptionModel> {
    const customIntegration: IntegrationModel = await this.integrationService.findOneByName('custom');
    const customIntegrationSubscription: IntegrationSubscriptionModel  = await this.integrationSubscriptionService
    .findOneByIntegrationAndBusiness(customIntegration, business);
    await this.integrationSubscriptionService.populateRules(customIntegrationSubscription);

    return customIntegrationSubscription;
  }

  @Get('subscription/:integrationName')
  @Acl({ microservice: 'shipping', action: AclActionsEnum.read })
  public async getSubscription(
    @ParamModel(':businessId', BusinessSchemaName) business: BusinessModel,
    @ParamModel({ name: ':integrationName' }, IntegrationSchemaName) integration: IntegrationModel,
  ): Promise<IntegrationSubscriptionModel> {
    const subscription: IntegrationSubscriptionModel  = await this.integrationSubscriptionService
      .findOneByIntegrationAndBusiness(integration, business);
    await this.integrationSubscriptionService.populateRules(subscription);

    return subscription;
  }
}
