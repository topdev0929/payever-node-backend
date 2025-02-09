import { Body, Controller, Delete, Get, NotFoundException, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { ParamModel } from '@pe/nest-kit';
import { JwtAuthGuard, Roles, RolesEnum } from '@pe/nest-kit/modules/auth';
import {
  ConnectionModel,
  ConnectionService,
  CreateConnectionActionsDto,
  IntegrationModel,
  IntegrationSchemaName,
  IntegrationSubscriptionModel,
  IntegrationSubscriptionService,
} from '@pe/third-party-sdk';

import { BusinessModel } from '../../business/models';
import { BusinessSchemaName } from '../../common/mongoose-schema.names';

@Controller('business/:businessId/plugins')
@ApiTags('plugins subscriptions')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
@Roles(RolesEnum.oauth)
export class PluginsSubscriptionController {
  constructor(
    private readonly subscriptionService: IntegrationSubscriptionService,
    private readonly connectionService: ConnectionService,
  ) { }

  @Get()
  public async getBusinessInfo(
    @ParamModel(':businessId', BusinessSchemaName) business: BusinessModel,
  ): Promise<BusinessModel> {
    return business;
  }

  @Get('subscription/:integrationName')
  public async getSubscription(
    @ParamModel(':businessId', BusinessSchemaName) business: BusinessModel,
    @ParamModel({ name: ':integrationName'}, IntegrationSchemaName) integration: IntegrationModel,
  ): Promise<ConnectionModel> {
    const connection: ConnectionModel =
      await this.connectionService.findFirstByBusinessAndIntegration(business, integration);
    if (!connection) {
      throw new NotFoundException(`Business ${business.id} doesn't have ${integration.name} connected`);
    }

    return connection;
  }

  /**
   * @deprecated this is old endpoint, should use OuterConnectionController::connect from SDK
   */
  @Post('subscription/:integrationName')
  public async connect(
    @ParamModel(':businessId', BusinessSchemaName) business: BusinessModel,
    @ParamModel({ name: ':integrationName'}, IntegrationSchemaName) integration: IntegrationModel,
    @Body() dto: CreateConnectionActionsDto,
  ): Promise<ConnectionModel> {
    const subscription: IntegrationSubscriptionModel =
      await this.subscriptionService.findOneByBusinessAndIntegration(business, integration);
    if (!subscription) {
      throw new NotFoundException(`Business ${business.id} doesn't have ${integration.name} installed`);
    }

    return this.connectionService.create(business, integration, dto.externalId, dto);
  }

  /**
   * @deprecated this is old endpoint, should use OuterConnectionController::disconnect from SDK
   */
  @Delete('subscription/:integrationName')
  public async disconnect(
    @ParamModel(':businessId', BusinessSchemaName) business: BusinessModel,
    @ParamModel({ name: ':integrationName'}, IntegrationSchemaName) integration: IntegrationModel,
  ): Promise<void> {
    const connection: ConnectionModel =
      await this.connectionService.findFirstByBusinessAndIntegration(business, integration);
    if (!connection) {
      throw new NotFoundException(`Business ${business.id} doesn't have ${integration.name} connected`);
    }

    return this.connectionService.remove(business, connection);
  }
}
