/* tslint:disable:no-identical-functions */
import {
  BadRequestException,
  Body,
  Controller,
  HttpException,
  HttpService,
  HttpStatus,
  Logger,
  Param,
  Patch,
  Req,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Acl, AclActionsEnum, ParamModel } from '@pe/nest-kit';
import { JwtAuthGuard, Roles, RolesEnum } from '@pe/nest-kit/modules/auth';
import { NestKitLogFactory } from '@pe/nest-kit/modules/logging';
import {
  ConnectionEventsProducer,
  ConsumerEventsEnum,
  IntegrationModel,
  IntegrationSchemaName,
} from '@pe/third-party-sdk';
import { AxiosError, AxiosResponse } from 'axios';
import { FastifyRequest } from 'fastify';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { BusinessModel } from '../../business/models';
import { BusinessSchemaName } from '../../common/mongoose-schema.names';
import { environment } from '../../environments';

const BUSINESS_ID_PLACEHOLDER: string = ':businessId';
const INTEGRATION_NAME_PLACEHOLDER: string = ':integrationName';

@Controller('business/:businessId/payments/:integrationName')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
@Roles(RolesEnum.merchant)
@ApiTags('payments')
export class PaymentProxyController {
  constructor(
    private readonly connectionProducer: ConnectionEventsProducer,
    private readonly http: HttpService,
    private readonly logger: Logger,
  ) { }

  @Patch('enable')
  @Acl({ microservice: 'connect', action: AclActionsEnum.update })
  public async enablePayment(
    @ParamModel(BUSINESS_ID_PLACEHOLDER, BusinessSchemaName) business: BusinessModel,
    @ParamModel({ name: INTEGRATION_NAME_PLACEHOLDER}, IntegrationSchemaName) integration: IntegrationModel,
  ): Promise<void> {
    await this.connectionProducer.sendEvent(
      ConsumerEventsEnum.IntegrationConnected,
      {
        business: {
          id: business.id,
        },
        integration: {
          category: integration.category,
          name: integration.name,
        },
      },
    );
  }

  @Patch(':paymentOptionId/credentials/set')
  @Acl({ microservice: 'connect', action: AclActionsEnum.update })
  public async setCredential(
    @ParamModel(BUSINESS_ID_PLACEHOLDER, BusinessSchemaName) business: BusinessModel,
    @Param('integrationName') integrationName: string,
    @Param('paymentOptionId') paymentOptionId: string,
    @Body() data: any,
    @Req() request: FastifyRequest,
  ): Promise<any> {
    const paymentsResponse: Observable<AxiosResponse<any>> = this.http.patch<any>(
      `${environment.paymentsAPIUrl}/api/rest/v3/business-payment-option/${paymentOptionId}`,
      data,
      {
        headers: {
          authorization: request.headers.authorization,
          'user-agent': request.headers['user-agent'],
        },
      },
    );

    return paymentsResponse.pipe(
      map((response: AxiosResponse<any>) => {
        this.connectionProducer.sendEvent(
          ConsumerEventsEnum.IntegrationConnected,
          {
            business: {
              id: business.id,
            },
            integration: {
              category: 'payments',
              name: integrationName,
            },
          },
        ).catch();

        return response.data;
      }),
      catchError((err: AxiosError) => {
        const exception: HttpException = PaymentProxyController.handleErrorResponse(err);
        this.logger.error(NestKitLogFactory.getLogFromAxiosError(err));

        return throwError(exception);
      }));
  }

  @Patch(':paymentOptionId/credentials/reset')
  @Acl({ microservice: 'connect', action: AclActionsEnum.update })
  public async resetCredential(
    @ParamModel(BUSINESS_ID_PLACEHOLDER, BusinessSchemaName) business: BusinessModel,
    @Param('integrationName') integrationName: string,
    @Param('paymentOptionId') paymentOptionId: string,
    @Req() request: FastifyRequest,
  ): Promise<any>  {
    const paymentsResponse: Observable<AxiosResponse<any>> = this.http.patch<any>(
      `${environment.paymentsAPIUrl}/api/rest/v1/business-payment-option` +
      `/${paymentOptionId}/reset-credentials`,
      null,
      {
        headers: {
          authorization: request.headers.authorization,
          'user-agent': request.headers['user-agent'],
        },
      },
    );

    return paymentsResponse.pipe(
      map((response: AxiosResponse<any>) => {
        this.connectionProducer.sendEvent(
          ConsumerEventsEnum.IntegrationDisconnected,
          {
            business: {
              id: business.id,
            },
            integration: {
              category: 'payments',
              name: integrationName,
            },
          },
        ).catch();

        return response.data;
      }),
      catchError((err: any) => {
        const exception: HttpException = PaymentProxyController.handleErrorResponse(err);
        this.logger.error(NestKitLogFactory.getLogFromAxiosError(err));

        return throwError(exception);
      }));
  }

  private static handleErrorResponse(err: AxiosError): HttpException {
    if (err && err.response) {
      if (err.response.status === HttpStatus.UNAUTHORIZED) {
        return new UnauthorizedException(err.response.data.message);
      } else if (err.response.status.toString().match(/4../)) {
        return new BadRequestException(err.response.data.message);
      }
    }

    return new HttpException(
      `An error occurred while connecting to payments microservice: ${err}`,
      HttpStatus.INTERNAL_SERVER_ERROR,
    );
  }
}
