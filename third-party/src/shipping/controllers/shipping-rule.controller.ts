import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  HttpService,
  Logger,
  Param,
  Post,
  Put,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard, Roles, RolesEnum } from '@pe/nest-kit/modules/auth';
import { NestKitLogFactory } from '@pe/nest-kit/modules/logging';
import { AxiosError, AxiosResponse } from 'axios';
import { FastifyRequest } from 'fastify';
import { Observable } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { environment } from '../../environments';
import { Acl, AclActionsEnum } from '@pe/nest-kit';

@Controller('business/:businessId/shipping-subscription/:subscriptionId')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
@Roles(RolesEnum.merchant)
@ApiTags('shipping')
export class ShippingRuleController {
  constructor(
    private readonly logger: Logger,
    private readonly http: HttpService,
  ) { }

  @Get('rules')
  @Acl({ microservice: 'connect', action: AclActionsEnum.read })
  public async getRules(
    @Req() request: FastifyRequest,
    @Param('businessId') businessId: string,
    @Param('subscriptionId') subscriptionId: string,
  ): Promise<any> {
    const endpoint: string = environment.shippingServiceEndpoints.getRules;
    const url: string = endpoint
      .replace(':businessId', businessId)
      .replace(':subscriptionId', subscriptionId);
    this.logger.log(`Shipping request going to:${url}`);
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
        throw new HttpException(err.response.data, err.response.status);
      }),
    );
  }

  @Post('rule')
  @Acl({ microservice: 'connect', action: AclActionsEnum.create })
  public async createRule(
    @Req() request: FastifyRequest,
    @Param('businessId') businessId: string,
    @Param('subscriptionId') subscriptionId: string,
    @Body() data: any,
  ): Promise<any> {
    const endpoint: string = environment.shippingServiceEndpoints.createRule;
    const url: string = endpoint
      .replace(':businessId', businessId)
      .replace(':subscriptionId', subscriptionId);
    this.logger.log(`Shipping request going to:${url}`);
    const response: Observable<AxiosResponse<any>> = this.http.post<any>(
      url,
      data,
      {
        data,
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
        throw new HttpException(err.response.data, err.response.status);
      }),
    );
  }

  @Put('rule/:ruleId')
  @Acl({ microservice: 'connect', action: AclActionsEnum.update })
  public async updateRule(
    @Req() request: FastifyRequest,
    @Param('businessId') businessId: string,
    @Param('subscriptionId') subscriptionId: string,
    @Param('ruleId') ruleId: string,
    @Body() data: any,
  ): Promise<any> {
    const endpoint: string = environment.shippingServiceEndpoints.rule;
    const url: string = endpoint
      .replace(':businessId', businessId)
      .replace(':subscriptionId', subscriptionId)
      .replace(':ruleId', ruleId);
    this.logger.log(`Shipping request going to:${url}`);
    const response: Observable<AxiosResponse<any>> = this.http.put<any>(
      url,
      data,
      {
        data,
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
        throw new HttpException(err.response.data, err.response.status);
      }),
    );
  }

  @Delete('rule/:ruleId')
  @Acl({ microservice: 'connect', action: AclActionsEnum.delete })
  public async deleteRule(
    @Req() request: FastifyRequest,
    @Param('businessId') businessId: string,
    @Param('subscriptionId') subscriptionId: string,
    @Param('ruleId') ruleId: string,
  ): Promise<any> {
    const endpoint: string = environment.shippingServiceEndpoints.rule;
    const url: string = endpoint
      .replace(':businessId', businessId)
      .replace(':subscriptionId', subscriptionId)
      .replace(':ruleId', ruleId);
    this.logger.log(`Shipping request going to:${url}`);
    const response: Observable<AxiosResponse<any>> = this.http.delete<any>(
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
        throw new HttpException(err.response.data, err.response.status);
      }),
    );
  }
}
