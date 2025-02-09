import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Acl, AclActionsEnum, JwtAuthGuard, ParamModel, Roles, RolesEnum } from '@pe/nest-kit';
import { BusinessService } from '@pe/business-kit';
import { BusinessModel } from '../../business';
import { BusinessSchemaName, IntegrationSchemaName } from '../../mongoose-schema';
import { IntegrationSubOutputConverter } from '../converters/integration-sub-output.converter';
import { BusinessIntegrationSubInterface } from '../interfaces';
import { BusinessIntegrationSubModel, IntegrationModel } from '../models';
import { BusinessIntegrationSubscriptionService, IntegrationService } from '../services';

@ApiTags('businessIntegration')
@Controller('business/:businessId/integration')
@UseGuards(JwtAuthGuard)
@Roles(RolesEnum.merchant)
@ApiBearerAuth()
export class BusinessIntegrationSubController {
  constructor(
    private readonly businessService: BusinessService,
    private readonly integrationService: IntegrationService,
    private readonly subscriptionService: BusinessIntegrationSubscriptionService,
  ) { }

  @Get()
  @Acl(
    { microservice: 'checkout', action: AclActionsEnum.read },
    { microservice: 'pos', action: AclActionsEnum.read },
    { microservice: 'transactions', action: AclActionsEnum.read },
  )
  public async findAll(
    @ParamModel(':businessId', BusinessSchemaName) business: BusinessModel,
  ): Promise<BusinessIntegrationSubInterface[]> {
    const subs: BusinessIntegrationSubModel[] = await this.subscriptionService.findByBusiness(business);
    const filteredSubs: BusinessIntegrationSubModel[] =
      await this.subscriptionService.filterByVisibleIntegrations(subs);

    return filteredSubs.map((sub: BusinessIntegrationSubModel) => IntegrationSubOutputConverter.convert(sub));
  }

  @Get('category/:category')
  @Acl({ microservice: 'checkout', action: AclActionsEnum.read })
  public async findByCategory(
    @ParamModel(':businessId', BusinessSchemaName) business: BusinessModel,
    @Param('category') category: string,
  ): Promise<BusinessIntegrationSubInterface[]> {
    const subs: BusinessIntegrationSubModel[] =
      await this.subscriptionService.findByBusinessAndCategory(business, category);
    const filteredSubs: BusinessIntegrationSubModel[] =
      await this.subscriptionService.filterByVisibleIntegrations(subs);

    return filteredSubs.map((sub: BusinessIntegrationSubModel) => IntegrationSubOutputConverter.convert(sub));
  }

  @Get(':integrationName')
  @Acl({ microservice: 'checkout', action: AclActionsEnum.read })
  public async findOne(
    @ParamModel({ name: ':integrationName'}, IntegrationSchemaName) integration: IntegrationModel,
    @ParamModel(':businessId', BusinessSchemaName) business: BusinessModel,
  ): Promise<{ }> {
    const subscription: BusinessIntegrationSubModel =
      await this.subscriptionService.findOneByIntegrationAndBusiness(integration, business);

    return {
      enabled: subscription.enabled,
      installed: subscription.installed,
      name: subscription.integration.name,
    };
  }
}
