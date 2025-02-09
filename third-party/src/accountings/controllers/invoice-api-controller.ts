import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  NotFoundException,
  Param,
  Post,
  Res,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Acl, AclActionsEnum, ParamModel } from '@pe/nest-kit';
import { JwtAuthGuard, Roles, RolesEnum } from '@pe/nest-kit/modules/auth';
import {
  IntegrationModel,
  IntegrationSchemaName,
  IntegrationSubscriptionModel,
  IntegrationSubscriptionService,
} from '@pe/third-party-sdk';
import { FastifyReply } from 'fastify';
import { BusinessSchemaName } from '@pe/business-kit';

import { BusinessModel } from '../../business/models';
import { CreateInvoiceDto } from '../dto';
import { CreateDraftInvoiceResponseInterface, InvoiceResponseInterface } from '../interfaces';
import { AccountingsApiService } from '../services/accountings-api-service';

const BUSINESS_ID_PLACEHOLDER: string = ':businessId';
const INTEGRATION_NAME_PLACEHOLDER: string = ':integrationName';

@Controller('business/:businessId/accountings/:integrationName/invoice')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
@Roles(RolesEnum.merchant)
@ApiTags('invoice')
export class InvoiceApiController {
  constructor(
    private readonly accountingsApiService: AccountingsApiService,
    private readonly subscriptionService: IntegrationSubscriptionService,
  ) { }

  @Get()
  @Acl({ microservice: 'connect', action: AclActionsEnum.read })
  public async get(
    @ParamModel(BUSINESS_ID_PLACEHOLDER, BusinessSchemaName) business: BusinessModel,
    @ParamModel({ name: INTEGRATION_NAME_PLACEHOLDER}, IntegrationSchemaName) integration: IntegrationModel,
    @Param('invoiceId') invoiceId: string,
  ): Promise<InvoiceResponseInterface> {
    const subscription: IntegrationSubscriptionModel =
      await this.subscriptionService.findOneByBusinessAndIntegration(business, integration);
    if (!subscription) {
      throw new NotFoundException(`Business ${business.id} doesn't have ${integration.name} installed`);
    }

    return this.accountingsApiService.getInvoice(integration.url, invoiceId);
  }

  @Post()
  @Acl({ microservice: 'connect', action: AclActionsEnum.update })
  public async create(
    @ParamModel(BUSINESS_ID_PLACEHOLDER, BusinessSchemaName) business: BusinessModel,
    @ParamModel({ name: INTEGRATION_NAME_PLACEHOLDER}, IntegrationSchemaName) integration: IntegrationModel,
    @Body() body: CreateInvoiceDto,
    @Res() res: FastifyReply<any>,
  ): Promise<void> {
    const subscription: IntegrationSubscriptionModel =
      await this.subscriptionService.findOneByBusinessAndIntegration(business, integration);
    if (!subscription) {
      throw new NotFoundException(`Business ${business.id} doesn't have ${integration.name} installed`);
    }

    const created: CreateDraftInvoiceResponseInterface =
      await this.accountingsApiService.createInvoice(integration.url, body);
    res.status(HttpStatus.CREATED).send(created);
  }

  @Post('book')
  @Acl({ microservice: 'connect', action: AclActionsEnum.update })
  public async book(
    @ParamModel(BUSINESS_ID_PLACEHOLDER, BusinessSchemaName) business: BusinessModel,
    @ParamModel({ name: INTEGRATION_NAME_PLACEHOLDER}, IntegrationSchemaName) integration: IntegrationModel,
    @Param('invoiceId') invoiceId: string,
    @Res() res: FastifyReply<any>,
  ): Promise<void> {
    const subscription: IntegrationSubscriptionModel =
      await this.subscriptionService.findOneByBusinessAndIntegration(business, integration);
    if (!subscription) {
      throw new NotFoundException(`Business ${business.id} doesn't have ${integration.name} installed`);
    }

    const created: any = this.accountingsApiService.bookInvoice(integration.url, invoiceId);
    res.status(HttpStatus.OK).send(created);
  }

  @Delete()
  @Acl({ microservice: 'connect', action: AclActionsEnum.delete })
  public async delete(
    @ParamModel(BUSINESS_ID_PLACEHOLDER, BusinessSchemaName) business: BusinessModel,
    @ParamModel({ name: INTEGRATION_NAME_PLACEHOLDER}, IntegrationSchemaName) integration: IntegrationModel,
    @Param('invoiceId') invoiceId: string,
    @Res() res: FastifyReply<any>,
  ): Promise<void> {
    const subscription: IntegrationSubscriptionModel =
      await this.subscriptionService.findOneByBusinessAndIntegration(business, integration);
    if (!subscription) {
      throw new NotFoundException(`Business ${business.id} doesn't have ${integration.name} installed`);
    }

    const created: any = this.accountingsApiService.deleteInvoice(integration.url, invoiceId);
    res.status(HttpStatus.OK).send(created);
  }
}
