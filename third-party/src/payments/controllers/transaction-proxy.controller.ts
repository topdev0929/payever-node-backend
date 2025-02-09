import { Body, Controller, Get, Param, Post, Req, Res } from '@nestjs/common';
import { ParamModel } from '@pe/nest-kit';
import { ConnectionModel, ConnectionSchemaName } from '@pe/third-party-sdk';
import { FastifyReply, FastifyRequest } from 'fastify';

import { InternalRequestProxy } from '../../common';
import { environment } from '../../environments';
import { PaymentActionDto } from '../dto';
import { EventProducer } from '../producer';

@Controller('transactions')
export class TransactionProxyController {
  constructor(
    private readonly eventProducer: EventProducer,
    private readonly internalRequestProxy: InternalRequestProxy,
  ) { }

  @Post(':authorizationId/action/:action')
  public async transactionActionAsync(
    @ParamModel(
      { authorizationId: ':authorizationId' },
      ConnectionSchemaName,
    ) connection: ConnectionModel,
    @Param('action') action: string,
    @Body() dto: PaymentActionDto,
  ): Promise<void> {
    await connection
      .populate('business')
      .populate('integration')
      .execPopulate()
    ;

    return this.eventProducer.sendOuterPaymentActionRequest(
      connection.business,
      connection.integration,
      action,
      dto,
    );
  }

  @Post(':businessId/:transactionUuid/action/:action')
  public async transactionAction(
    @Param('businessId') businessId: string,
    @Param('transactionUuid') transactionUuid: string,
    @Param('action') action: string,
    @Req() request: FastifyRequest,
    @Res() response: FastifyReply<any>,
  ): Promise<any> {
    return this.internalRequestProxy.proxyRequest(
      `${environment.transactionsUrl}/api/business/${businessId}/${transactionUuid}/action/${action}`,
      request,
      response,
    );
  }

  @Get(':businessId/detail/:transactionUuid')
  public async getTransactionByUuid(
    @Param('businessId') businessId: string,
    @Param('transactionUuid') transactionUuid: string,
    @Req() request: FastifyRequest,
    @Res() response: FastifyReply<any>,
  ): Promise<any> {
    return this.internalRequestProxy.proxyRequest(
      `${environment.transactionsUrl}/api/business/${businessId}/detail/${transactionUuid}`,
      request,
      response,
    );
  }

  @Get(':businessId/detail/original_id/:original_id')
  public async getTransactionByOriginalId(
    @Param('businessId') businessId: string,
    @Param('original_id') originalId: string,
    @Req() request: FastifyRequest,
    @Res() response: FastifyReply<any>,
  ): Promise<any> {
    return this.internalRequestProxy.proxyRequest(
      `${environment.transactionsUrl}/api/business/${businessId}/detail/original_id/${originalId}`,
      request,
      response,
    );
  }

  @Get(':businessId/detail/reference/:reference')
  public async getTransactionByReference(
    @Param('businessId') businessId: string,
    @Param('reference') reference: string,
    @Req() request: FastifyRequest,
    @Res() response: FastifyReply<any>,
  ): Promise<any> {
    return this.internalRequestProxy.proxyRequest(
      `${environment.transactionsUrl}/api/business/${businessId}/detail/reference/${reference}`,
      request,
      response,
    );
  }
}
