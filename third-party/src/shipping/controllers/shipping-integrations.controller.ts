import { Controller, Get, HttpService, Logger, Param, Req, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard, Roles, RolesEnum } from '@pe/nest-kit/modules/auth';
import { NestKitLogFactory } from '@pe/nest-kit/modules/logging';
import { AxiosError, AxiosResponse } from 'axios';
import { FastifyRequest } from 'fastify';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { environment } from '../../environments';
import { Acl, AclActionsEnum } from '@pe/nest-kit';

@Controller('business/:businessId/shipping/:integrationName')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
@Roles(RolesEnum.merchant)
@ApiTags('shipping')
export class ShippingIntegrationsController {
  constructor(
    private readonly logger: Logger,
    private readonly http: HttpService,
  ) { }

  @Get('get-subscription')
  @Acl({ microservice: 'connect', action: AclActionsEnum.read })
  public async getShippingSubscription(
    @Req() request: FastifyRequest,
    @Param('businessId') businessId: string,
    @Param('integrationName') integrationName: string,
  ): Promise<any> {
    const endpoint: string = environment.shippingServiceEndpoints.getShippingSubscription;
    const url: string = endpoint
      .replace(':businessId', businessId)
      .replace(':integrationName', integrationName);
    const response: Observable<AxiosResponse<any>> = this.http.get<any>(
      url,
      {
        headers: {
          'User-Agent': request.headers['user-agent'],
          authorization: request.headers.authorization,
        },
      },
    );

    return response.pipe(
      map((res: any) => {
        return res.data;
      }),
      catchError((err: AxiosError) => {
        this.logger.error(NestKitLogFactory.getLogFromAxiosError(err));

        return throwError(err);
      }),
    );
  }
}
