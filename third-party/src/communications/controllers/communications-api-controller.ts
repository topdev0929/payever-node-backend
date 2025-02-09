import { Body, Controller, Get, HttpStatus, NotFoundException, Post, Res, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Acl, AclActionsEnum, ParamModel } from '@pe/nest-kit';
import { JwtAuthGuard, Roles, RolesEnum } from '@pe/nest-kit/modules/auth';
import {
  IntegrationModel,
  IntegrationSchemaName,
  IntegrationSubscriptionModel,
  IntegrationSubscriptionService,
} from '@pe/third-party-sdk';
import { Response } from 'express';
import { BusinessModel } from '../../business/models';
import { BusinessSchemaName } from '../../common/mongoose-schema.names';
import { SendMessageDto } from '../dto';
import { CommunicationsApiService } from '../services/communications-api-service';

const BUSINESS_ID_PLACEHOLDER: string = ':businessId';
const INTEGRATION_NAME_PLACEHOLDER: string = ':integrationName';

@Controller('business/:businessId/communications/:integrationName')
@ApiTags('communications')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class CommunicationsApiController {
  constructor(
    private readonly communicationsApiService: CommunicationsApiService,
    private readonly subscriptionService: IntegrationSubscriptionService,
  ) { }

  @Roles(RolesEnum.merchant)
  @Get('numbers')
  @Acl({ microservice: 'connect', action: AclActionsEnum.read })
  public async get(
    @ParamModel(BUSINESS_ID_PLACEHOLDER, BusinessSchemaName) business: BusinessModel,
    @ParamModel({ name: INTEGRATION_NAME_PLACEHOLDER}, IntegrationSchemaName) integration: IntegrationModel,
  ): Promise<string[]> {
    const subscription: IntegrationSubscriptionModel =
      await this.subscriptionService.findOneByBusinessAndIntegration(business, integration);
    if (!subscription) {
      throw new NotFoundException(`Business ${business.id} doesn't have ${integration.name} installed`);
    }

    return this.communicationsApiService.getNumbers(integration, business);
  }

  @Roles(RolesEnum.anonymous)
  @Post('send')
  @Acl({ microservice: 'connect', action: AclActionsEnum.update })
  public async sendMessage(
    @ParamModel(BUSINESS_ID_PLACEHOLDER, BusinessSchemaName) business: BusinessModel,
    @ParamModel({ name: INTEGRATION_NAME_PLACEHOLDER}, IntegrationSchemaName) integration: IntegrationModel,
    @Body() sendMessageDto: SendMessageDto,
    @Res() response: Response,
  ): Promise<void> {
    const subscription: IntegrationSubscriptionModel =
      await this.subscriptionService.findOneByBusinessAndIntegration(business, integration);
    if (!subscription) {
      throw new NotFoundException(`Business ${business.id} doesn't have ${integration.name} installed`);
    }
    try {
      const result: any = await this.communicationsApiService.sendMessage(integration, business, sendMessageDto);
      response
        .status(HttpStatus.OK)
        .send(result);
    } catch (error) {
      if (!error.response) {
        throw error;
      }
      response
        .status(error.response.status ? error.response.status : HttpStatus.INTERNAL_SERVER_ERROR)
        .send(error.response.data ? error.response.data : []);
    }
  }
}
