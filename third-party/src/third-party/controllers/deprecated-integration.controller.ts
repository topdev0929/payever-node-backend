import { Body, Controller, Logger, NotFoundException, Post, Req, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Acl, AclActionsEnum, JwtAuthGuard, ParamModel, Roles, RolesEnum } from '@pe/nest-kit';
import {
  IntegrationModel,
  IntegrationSchemaName,
  IntegrationSubscriptionModel,
  IntegrationSubscriptionService,
} from '@pe/third-party-sdk';
import { Method } from 'axios';
import { FastifyRequest } from 'fastify';

import { BusinessModel } from '../../business/models';
import { BusinessSchemaName } from '../../common/mongoose-schema.names';
import { DeprecatedIntegrationApiService } from '../services';

const BUSINESS_ID_PLACEHOLDER: string = ':businessId';
const INTEGRATION_NAME_PLACEHOLDER: string = ':integrationName';

@Controller('business/:businessId/subscription')
@ApiTags('business subscriptions')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
@Roles(RolesEnum.merchant)
export class DeprecatedIntegrationController {
  constructor(
    private readonly integrationApiService: DeprecatedIntegrationApiService,
    private readonly subscriptionService: IntegrationSubscriptionService,
    private readonly logger: Logger,
  ) { }

  /**
   * @deprecated Use IntegrationSubscriptionController::executeAction instead
   */
  @Post(':integrationName/call')
  @Acl({ microservice: 'connect', action: AclActionsEnum.update })
  public async postExternal(
    @ParamModel(BUSINESS_ID_PLACEHOLDER, BusinessSchemaName) business: BusinessModel,
    @ParamModel({ name: INTEGRATION_NAME_PLACEHOLDER}, IntegrationSchemaName) integration: IntegrationModel,
    @Body() body: any,
    @Req() req: FastifyRequest,
  ): Promise<any> {
    const subscription: IntegrationSubscriptionModel =
      await this.subscriptionService.findOneByBusinessAndIntegration(business, integration);
    if (!subscription) {
      throw new NotFoundException(`Business ${business.id} doesn't have ${integration.name} installed`);
    }

    const { apiUrl, httpMethod }: { apiUrl: string; httpMethod: Method } = body;
    this.logger.log({
      context: 'IntegrationDeprecatedController',
      message: `Calling third-party apiUrl: ${apiUrl}, method: ${httpMethod}, businessId: ${business.id}`,
    });

    return this.integrationApiService.callIntegration(
      business,
      integration,
      httpMethod,
      apiUrl,
      body,
      req.headers,
    );
  }
}
