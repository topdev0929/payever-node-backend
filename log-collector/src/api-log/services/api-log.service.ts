import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { TokenHelper } from '@pe/nest-kit/modules/auth/token.helper';
import { ApiLogFilterRequestDto, ApiLogFilterResultDto, ApiLogResponseDto } from '../dto';
import { ApiLogSchemaName } from '../schemas';
import { ApiLogModel } from '../models';
import { ApiLogInterface } from '../interface';
import { plainToClass } from 'class-transformer';
import {
  AccessTokenPayload,
  RedisClient, RolesEnum,
  UserRoleMerchant, UserRoleOauth,
  UserTokenInterface,
} from '@pe/nest-kit';
import * as moment from 'moment';
import { ApiSourcesEnum } from '../enums';

export class ApiLogService {
  constructor(
    @InjectModel(ApiLogSchemaName) private readonly apiLogModel: Model<ApiLogModel>,
    private readonly redisClient: RedisClient,
  ) { }

  public async getLogs(
    user: AccessTokenPayload,
    filter: ApiLogFilterRequestDto,
  ): Promise<ApiLogFilterResultDto> {
    const merchantRole: UserRoleMerchant = user?.getRole(RolesEnum.merchant);
    const oauthRole: UserRoleOauth = user?.getRole(RolesEnum.oauth);
    const businessId = merchantRole?.permissions?.[0]?.businessId || oauthRole?.permissions?.[0]?.businessId;

    const query: any = { businessId, userId: user.id };
    if (filter.from && filter.to) {
      query.createdAt = { $gte: filter.from, $lt: moment(filter.to).add(1, 'day').toDate() };
    }
    if (filter.origin) {
      query['request.hostname'] = filter.origin;
    }
    if (filter.ip) {
      query['request.ip'] = filter.ip;
    }
    if (filter.serviceName) {
      query.serviceName = filter.serviceName;
    }
    if (filter.source) {
      query.source = filter.source;
    }

    const sort: { [key: string]: string } = { };
    if (filter.orderBy) {
      sort[filter.orderBy] = filter.direction;
    }

    const defaultMaxLimit: number = 100;
    const defaultLimit: number = 20;
    if (filter.limit > defaultMaxLimit) {
      filter.limit = defaultMaxLimit;
    }
    if (!filter.page) {
      filter.page = 1;
    }

    const total: number = await this.apiLogModel.find(query).count();
    const limit: number = filter.limit ?? defaultLimit;
    const offset: number = limit * (filter.page - 1);
    const totalPages: number = Math.floor(total / limit) + 1;
    const apiLogModels: ApiLogModel[] = await this.apiLogModel
      .find(query)
      .select(filter?.projection ?? { })
      .sort(sort)
      .limit(limit)
      .skip(offset)
      .lean();

    const logs: ApiLogResponseDto[] = this.transformToLogResponse(apiLogModels);

    return { total, page: filter.page, totalPages, logs };
  }

  public async create(log: ApiLogInterface): Promise<ApiLogModel> {
    const parsedToken: { user?: UserTokenInterface } = TokenHelper.extractTokenPayload(log.request);

    if (parsedToken) {
      const cachedToken: string = await this.redisClient.get(parsedToken?.user?.tokenId);
      if (cachedToken) {
        const user: AccessTokenPayload = plainToClass(AccessTokenPayload, JSON.parse(cachedToken));
        const merchantBusiness: UserRoleMerchant = user?.getRole(RolesEnum.merchant);
        const oauthBusiness: UserRoleOauth = user?.getRole(RolesEnum.oauth);
        log.businessId = merchantBusiness?.permissions?.[0]?.businessId || oauthBusiness?.permissions?.[0]?.businessId;
        log.userEmail = user.email;
        log.userId = user.id;
        log.source = this.getSource(user);
      }
    }

    return this.apiLogModel.create(log);
  }

  private getSource(user: AccessTokenPayload): ApiSourcesEnum {
    if (user.hasRole(RolesEnum.oauth)) {
      return ApiSourcesEnum.oauth;
    }
    if (user.hasRole(RolesEnum.anonymous)) {
      return ApiSourcesEnum.anonymous;
    }
    if (user.hasRole(RolesEnum.guest)) {
      return ApiSourcesEnum.guest;
    }

    return ApiSourcesEnum.platform;
  }

  private transformToLogResponse(apiLogModels: ApiLogModel[]): ApiLogResponseDto[] {
    return apiLogModels.map(logModel => ({
      apiVersion: '',
      correlationID: '',
      error: logModel.response.error,
      httpCode: logModel.response.statusCode,
      httpMethod: logModel.request.method,
      idempotencyKey: logModel.request.headers?.['idempotency-key'],
      ip: logModel.request.ip,
      logId: logModel._id,
      origin: logModel.request.hostname,
      requestBody: logModel.request.body,
      responseBody: logModel.response.data,
      routerPath: logModel.request.routerPath,
      serviceName: logModel.serviceName,
      source: logModel.source,
      timestamp: logModel.createdAt,
      url: logModel.request.url,
    }) as ApiLogResponseDto);
  }
}
