import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Acl, AclActionsEnum, JwtAuthGuard, ParamModel, Roles, RolesEnum } from '@pe/nest-kit';
import { BusinessService } from '@pe/business-kit';
import { BusinessModel } from '../../business';
import { BusinessSchemaName, IntegrationSchemaName } from '../../mongoose-schema/mongoose-schema.names';
import { IntegrationModel, IntegrationSubscriptionModel } from '../models';
import { BusinessIntegrationSubscriptionService, IntegrationService } from '../services';

@ApiTags('businessIntegration')
@Controller('business/:businessId/integration')
@UseGuards(JwtAuthGuard)
@Roles(RolesEnum.merchant)
@ApiBearerAuth()
export class BusinessIntegrationSubscriptionController {
  constructor(
    private readonly businessService: BusinessService,
    private readonly integrationService: IntegrationService,
    private readonly subscriptionService: BusinessIntegrationSubscriptionService,
  ) { }

  @Get()
  @Acl({ microservice: 'pos', action: AclActionsEnum.read })
  public async findAll(
    @ParamModel('businessId', BusinessSchemaName) business: BusinessModel,
  ): Promise<IntegrationSubscriptionModel[]> {
    return this.subscriptionService.findByCategory(business);
  }

  @Get('category/:category')
  @Acl({ microservice: 'pos', action: AclActionsEnum.read })
  public async findByCategory(
    @ParamModel('businessId', BusinessSchemaName) business: BusinessModel,
    @Param('category') category: string,
  ): Promise<IntegrationSubscriptionModel[]> {
    return this.subscriptionService.findByCategory(business, category);
  }

  @Get(':integrationName')
  @Acl({ microservice: 'pos', action: AclActionsEnum.read })
  public async findOne(
    @ParamModel('businessId', BusinessSchemaName) business: BusinessModel,
    @ParamModel({ name: 'integrationName' }, IntegrationSchemaName) integration: IntegrationModel,
  ): Promise<{ }> {
    const subscription: IntegrationSubscriptionModel =
      await this.subscriptionService.findOneByIntegrationAndBusiness(integration, business);

    return {
      installed: subscription.installed,
      name: subscription.integration.name,
    };
  }
}
