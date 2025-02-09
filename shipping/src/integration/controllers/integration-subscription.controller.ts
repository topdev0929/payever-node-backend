import { Controller, HttpStatus, Put, UseGuards, Post, Body, Get, Delete } from '@nestjs/common';
import { ApiTags, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { Acl, AclActionsEnum, JwtAuthGuard, Roles, RolesEnum } from '@pe/nest-kit/modules/auth';
import { BusinessModel } from '../../business/models';
import { BusinessServiceLocal } from '../../business/services';
import { IntegrationSubscriptionService, IntegrationRuleService } from '../services';
import { ParamModel } from '@pe/nest-kit';
import { BusinessSchemaName } from '../../business/schemas';
import { IntegrationSubscriptionSchemaName, IntegrationRuleSchemaName } from '../schemas';
import { CreateIntegrationRuleDto, UpdateIntegrationRuleDto } from '../dto/rules';
import { IntegrationSubscriptionModel, IntegrationRuleModel } from '../models';


export const SUBSCRIPTION_ID: string = ':subscriptionId';
@Controller('business/:businessId/integration-subscriptions/:subscriptionId')
@UseGuards(JwtAuthGuard)
@ApiTags('Business Integration Subscriptions')
@ApiBearerAuth()
@Roles(RolesEnum.merchant)
@ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Invalid authorization token.' })
@ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Unauthorized.' })
export class IntegrationSubscriptionController {
  constructor(
    private readonly businessServiceLocal: BusinessServiceLocal,
    private readonly integrationSubscriptionService: IntegrationSubscriptionService,
    private readonly integrationRuleService: IntegrationRuleService,
  ) { }

  @Put('switch-on')
  @Acl({ microservice: 'shipping', action: AclActionsEnum.update })
  public async switchOn(
    @ParamModel(':businessId', BusinessSchemaName) business: BusinessModel,
    @ParamModel(SUBSCRIPTION_ID, IntegrationSubscriptionSchemaName) subscription: IntegrationSubscriptionModel,
  ): Promise<BusinessModel> {
    await this.integrationSubscriptionService.enable(subscription, business);
    await this.businessServiceLocal.populateIntegrations(business);
    const customSubscription: IntegrationSubscriptionModel = business.integrationSubscriptions
      .find((s: IntegrationSubscriptionModel) => s.integration.name === 'custom');
    if (customSubscription && customSubscription.enabled && customSubscription.installed) {
      await this.integrationSubscriptionService.disable(customSubscription);
    }

    return business;
  }

  @Put('switch-off')
  @Acl({ microservice: 'shipping', action: AclActionsEnum.update })
  public async switchOff(
    @ParamModel(':businessId', BusinessSchemaName) business: BusinessModel,
    @ParamModel(SUBSCRIPTION_ID, IntegrationSubscriptionSchemaName) subscription: IntegrationSubscriptionModel,
  ): Promise<BusinessModel> {
    await this.integrationSubscriptionService.disable(subscription);
    await this.businessServiceLocal.populateIntegrations(business);
    const customSubscription: IntegrationSubscriptionModel = business.integrationSubscriptions
      .find((s: IntegrationSubscriptionModel) => s.integration.name === 'custom');
    const otherActiveSubscriptions: IntegrationSubscriptionModel[] = business.integrationSubscriptions
      .filter((s: IntegrationSubscriptionModel) =>
        s.integration.name !== 'custom' &&
        s.enabled);
    if (customSubscription && !customSubscription.enabled && otherActiveSubscriptions.length === 0) {
      await this.integrationSubscriptionService.enable(customSubscription, business);
    }

    return business;
  }

  @Post('rule')
  @Acl({ microservice: 'shipping', action: AclActionsEnum.create })
  public async createRule(
    @ParamModel(SUBSCRIPTION_ID, IntegrationSubscriptionSchemaName) subscription: IntegrationSubscriptionModel,
    @Body() dto: CreateIntegrationRuleDto,
  ): Promise<IntegrationSubscriptionModel> {
    const rule: IntegrationRuleModel = await this.integrationRuleService.create(dto);

    return this.integrationSubscriptionService.addRule(rule, subscription);
  }

  @Get('rules')
  @Acl({ microservice: 'shipping', action: AclActionsEnum.read })
  public async getRules(
    @ParamModel(SUBSCRIPTION_ID, IntegrationSubscriptionSchemaName) subscription: IntegrationSubscriptionModel,
  ): Promise<IntegrationRuleModel[]> {
    const subscriptionWithRules: IntegrationSubscriptionModel = await this.integrationSubscriptionService
      .populateRules(subscription);

    return subscriptionWithRules.rules;
  }

  @Put('rule/:ruleId')
  @Acl({ microservice: 'shipping', action: AclActionsEnum.update })
  public async updateRule(
    @ParamModel(':ruleId', IntegrationRuleSchemaName) rule: IntegrationRuleModel,
    @Body() dto: UpdateIntegrationRuleDto,
  ): Promise<IntegrationRuleModel> {

    return this.integrationRuleService.update(rule, dto);
  }

  @Delete('rule/:ruleId')
  @Acl({ microservice: 'shipping', action: AclActionsEnum.delete })
  public async deleteRule(
    @ParamModel(':ruleId', IntegrationRuleSchemaName) rule: IntegrationRuleModel,
    @ParamModel(SUBSCRIPTION_ID, IntegrationSubscriptionSchemaName) subscription: IntegrationSubscriptionModel,
  ): Promise<IntegrationRuleModel> {
    await this.integrationSubscriptionService.removeRule(rule, subscription);

    return this.integrationRuleService.delete(rule);
  }
}
