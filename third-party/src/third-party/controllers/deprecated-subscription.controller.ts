import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  HttpStatus,
  Logger,
  NotFoundException,
  Param,
  Post,
  Res,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Acl, AclActionsEnum, JwtAuthGuard, ParamModel, Roles, RolesEnum } from '@pe/nest-kit';
import {
  ActionChooser,
  ConnectionModel,
  ConnectionService,
  InnerActionModel,
  IntegrationApiService,
  IntegrationModel,
  IntegrationSchemaName,
  IntegrationSubscriptionModel,
  IntegrationSubscriptionService,
} from '@pe/third-party-sdk';
import { FastifyReply } from 'fastify';

import { BusinessModel } from '../../business/models';
import { BusinessSchemaName } from '../../common/mongoose-schema.names';

const BUSINESS_ID_PLACEHOLDER: string = ':businessId';
const INTEGRATION_NAME_PLACEHOLDER: string = ':integrationName';

@Controller('business/:businessId/subscription')
@ApiTags('business subscriptions')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
@Roles(RolesEnum.merchant)
export class DeprecatedSubscriptionController {
  constructor(
    private readonly subscriptionService: IntegrationSubscriptionService,
    private readonly apiService: IntegrationApiService,
    private readonly connectionService: ConnectionService,
    private readonly logger: Logger,
  ) { }

  @Post(':integrationName/action/:action')
  @Acl({ microservice: 'connect', action: AclActionsEnum.create })
  public async executeAction(
    @ParamModel(BUSINESS_ID_PLACEHOLDER, BusinessSchemaName) business: BusinessModel,
    @ParamModel({ name: INTEGRATION_NAME_PLACEHOLDER}, IntegrationSchemaName) integration: IntegrationModel,
    @Param('action') action: string,
    @Body() body: any,
  ): Promise<any> {
    const subscription: IntegrationSubscriptionModel =
      await this.subscriptionService.findOneByBusinessAndIntegration(business, integration);
    if (!subscription) {
      throw new NotFoundException(`Business ${business.id} has not ${integration.name} installed`);
    }

    const connection: ConnectionModel =
      await this.connectionService.findFirstByBusinessAndIntegration(business, integration);
    if (!connection) {
      throw new NotFoundException(`Business ${business.id} has not ${integration.name} connected`);
    }

    const actionModel: InnerActionModel = ActionChooser.chooseAppropriateAction(integration, action);
    if (!actionModel) {
      throw new NotFoundException(`Integration ${integration.name} has not ${action} action.`);
    }

    return this.apiService.action(business, integration, actionModel, body ? body : { }, connection);
  }

  @Get(':integrationName/connect/status')
  @Acl({ microservice: 'connect', action: AclActionsEnum.read })
  public async getConnectionStatus(
    @ParamModel(BUSINESS_ID_PLACEHOLDER, BusinessSchemaName) business: BusinessModel,
    @ParamModel({ name: INTEGRATION_NAME_PLACEHOLDER}, IntegrationSchemaName) integration: IntegrationModel,
    @Res() res: FastifyReply<any>,
  ): Promise<void> {
    const subscription: IntegrationSubscriptionModel =
      await this.subscriptionService.findOneByBusinessAndIntegration(business, integration);
    if (!subscription) {
      throw new NotFoundException(`Business ${business.id} has not ${integration.name} installed`);
    }

    const connection: ConnectionModel =
      await this.connectionService.findFirstByBusinessAndIntegration(business, integration);

    res.status(HttpStatus.OK).send(Boolean(connection));
  }

  @Post(':integrationName/connect')
  @Acl({ microservice: 'connect', action: AclActionsEnum.create })
  public async connect(
    @ParamModel(BUSINESS_ID_PLACEHOLDER, BusinessSchemaName) business: BusinessModel,
    @ParamModel({ name: INTEGRATION_NAME_PLACEHOLDER}, IntegrationSchemaName) integration: IntegrationModel,
    @Body() body: any,
  ): Promise<{ id: string }> {
    const subscription: IntegrationSubscriptionModel =
      await this.subscriptionService.findOneByBusinessAndIntegration(business, integration);
    if (!subscription) {
      throw new NotFoundException(`Business ${business.id} has not ${integration.name} installed`);
    }

    const action: string = 'connect';
    const actionModel: InnerActionModel = ActionChooser.chooseAppropriateAction(integration, action);
    if (!actionModel) {
      this.logger.warn({
        context: 'IntegrationSubscriptionBusMessageController',
        message: `Integration ${integration.name} has not ${action} action.`,

        action,
        business,
        integration,
      });

      throw new NotFoundException(`Integration ${integration.name} has not ${action} action.`);
    }

    const result: any = await this.apiService.action(business, integration, actionModel, { });
    const authorizationId: string = result.id;
    if (!authorizationId) {
      throw new HttpException(`Connection to ${integration.name} did not established`, 412);
    }

    this.logger.log({
      context: 'IntegrationSubscriptionBusMessageController',
      message: `Action '${action}' for '${integration.name}' of business '${business.id}' finished.`,

      action,
      business,
      integration,
      result,
    });

    return { id: authorizationId };
  }

  @Delete(':integrationName/disconnect')
  @Acl({ microservice: 'connect', action: AclActionsEnum.delete })
  public async disconnect(
    @ParamModel(BUSINESS_ID_PLACEHOLDER, BusinessSchemaName) business: BusinessModel,
    @ParamModel({ name: INTEGRATION_NAME_PLACEHOLDER}, IntegrationSchemaName) integration: IntegrationModel,
  ): Promise<void> {
    const subscription: IntegrationSubscriptionModel =
      await this.subscriptionService.findOneByBusinessAndIntegration(business, integration);
    if (!subscription) {
      throw new NotFoundException(`Business ${business.id} has not ${integration.name} installed`);
    }

    const action: string = 'disconnect';
    const connections: ConnectionModel[] =
      await this.connectionService.findByBusinessAndIntegration(business, integration);
    for (const connection of connections) {
      if (!connection.authorizationId) {
        continue;
      }

      const actionModel: InnerActionModel = ActionChooser.chooseAppropriateAction(integration, action);
      if (actionModel) {
        await this.apiService.action(business, integration, actionModel, { }, connection);
      } else {
        this.logger.warn({
          context: 'IntegrationSubscriptionBusMessageController',
          message: `Integration ${integration.name} has not ${action} action.`,

          action,
          business,
          integration,
        });
      }
    }
  }
}
