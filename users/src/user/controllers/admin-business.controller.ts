import {
  Body, Controller, Delete, Get, Header, HttpCode,
  HttpStatus,
  NotFoundException, Patch, Post, Query, UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';

import { ParamModel } from '@pe/nest-kit';
import {
  JwtAuthGuard,
  Roles,
  RolesEnum,
  User,
  UserTokenInterface,
} from '@pe/nest-kit/modules/auth';
import {
  AdminBusinessListDto, CreateBusinessDto, GetBusinessDto, TrafficSourceDto,
  UpdateBusinessDto,
} from '../dto';
import { BusinessModel, UserModel } from '../models';
import { BusinessEventsProducer } from '../producers';
import { BusinessSchemaName, UserSchemaName } from '../schemas';
import {
  BusinessListRetriever, BusinessService, TrafficSourceService,
  UserService,
} from '../services';

const ContentType: string = 'Content-Type';
const ApplicationJson: string = 'application/json';
const invalidAuthApi: any = { status: 400, description: 'Invalid authorization token.' };
const unauthorizedApi: any = { status: 401, description: 'Unauthorized.' };

@Controller('admin/business')
@ApiTags('admin')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Roles(RolesEnum.admin)
export class AdminBusinessController {
  private static readonly BUSINESS_ID: string = ':businessId';

  constructor(
    private readonly businessListRetriever: BusinessListRetriever,
    private readonly businessService: BusinessService,
    private readonly userService: UserService,
    private readonly businessEventsProducer: BusinessEventsProducer,
    private readonly trafficSourceService: TrafficSourceService,
  ) { }

  @HttpCode(HttpStatus.OK)
  @Header(ContentType, ApplicationJson)
  @Get('list')
  @ApiBearerAuth()
  @ApiResponse({
    description: 'The business list have been successfully fetched.',
    isArray: true,
    status: 200,
    type: GetBusinessDto,
  })
  @ApiResponse(invalidAuthApi)
  @ApiResponse(unauthorizedApi)
  public async getBusinessesList (
    @Query() query: AdminBusinessListDto,
  ): Promise<any[]> {

    return this.businessListRetriever.retrieveListForAdmin(query);
  }

  @HttpCode(HttpStatus.OK)
  @Header(ContentType, ApplicationJson)
  @Get(AdminBusinessController.BUSINESS_ID)
  @ApiBearerAuth()
  @ApiResponse({
    description: 'The business entity has been successfully fetched.',
    isArray: true,
    status: 200,
    type: GetBusinessDto,
  })
  @ApiResponse(invalidAuthApi)
  @ApiResponse(unauthorizedApi)
  public async getOneBusinesses (
    @ParamModel(AdminBusinessController.BUSINESS_ID, BusinessSchemaName) business: BusinessModel,
  ): Promise<any> {

    return business;
  }

  @HttpCode(HttpStatus.OK)
  @Header(ContentType, ApplicationJson)
  @Post(':userId')
  @ApiBearerAuth()
  @ApiResponse({ status: 200, description: 'The business has been successfully created.' })
  @ApiResponse(invalidAuthApi)
  @ApiResponse(unauthorizedApi)
  public async createBusiness (
    @ParamModel('userId', UserSchemaName) user: UserModel,
    @Body() createBusinessDto: CreateBusinessDto,
  ): Promise<BusinessModel> {

    const trafficSource: TrafficSourceDto = createBusinessDto.trafficSource;
    delete createBusinessDto.trafficSource;

    const business: BusinessModel = await this.businessService.createBusiness(user, createBusinessDto);

    if (trafficSource) {
      await this.trafficSourceService.createTrafficSource(business, trafficSource);
    }

    return business;
  }

  @HttpCode(HttpStatus.OK)
  @Header(ContentType, ApplicationJson)
  @Patch(AdminBusinessController.BUSINESS_ID)
  @Roles(RolesEnum.merchant)
  @ApiBearerAuth()
  public async updateBusiness (
    @User() userToken: UserTokenInterface,
    @ParamModel('businessId', BusinessSchemaName) business: BusinessModel,
    @Body() updateBusinessDto: UpdateBusinessDto,
  ): Promise<BusinessModel> {

    const user: UserModel = await this.userService.findOneByUserToken(userToken);
    if (!user) {
      throw new NotFoundException(`User not found`);
    }

    const updatedBusiness: BusinessModel = await this.businessService.updateBusiness(business, updateBusinessDto);
    await this.businessEventsProducer.produceBusinessUpdatedEvent(user, updatedBusiness);

    return updatedBusiness;
  }

  @HttpCode(HttpStatus.OK)
  @Header(ContentType, ApplicationJson)
  @Delete(AdminBusinessController.BUSINESS_ID)
  @ApiBearerAuth()
  public async deleteBusiness (
    @User() userToken: UserTokenInterface,
    @ParamModel(AdminBusinessController.BUSINESS_ID, BusinessSchemaName) business: BusinessModel,
  ): Promise<void> {

    const user: UserModel = await this.userService.findOneByUserToken(userToken);
    if (!user) {
      throw new NotFoundException(`User not found`);
    }

    await this.businessService.deleteBusiness(business);
    await this.businessEventsProducer.produceBusinessRemovedEvent(user, business);
  }

}
