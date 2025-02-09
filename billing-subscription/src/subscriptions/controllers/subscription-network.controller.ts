import { Body, Controller, Delete, HttpCode, HttpStatus, Post, Get, Patch, UseGuards, Query } from '@nestjs/common';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import {
  AbstractController,
  AccessTokenPayload,
  Acl,
  AclActionsEnum,
  JwtAuthGuard,
  ParamModel,
  Roles,
  RolesEnum,
  TokensResultModel,
  User,
} from '@pe/nest-kit';
import { BusinessSchemaName } from '@pe/business-kit';
import { BusinessModel } from '../../business';
import { SubscriptionNetworkService } from '../services';
import { SubscriptionNetworkModel } from '../models';
import { SubscriptionNetworkDto, AppWithAccessConfigDto, IsValidNameDto } from '../dto';

import { SubscriptionNetworkSchemaName } from '../schemas';
import { environment } from '../../environments';
import { ValidateSubscriptionNameResponseInterface } from '../interfaces';

const INVALID_CREDENTIALS_MESSAGE: string = 'Invalid credentials';
const BUSINESS_ID: string = ':businessId';
const MICROSERVICE: string = 'subscriptions';

@Controller('business/:businessId/subscription-network')
@ApiTags('subscription-network')
@UseGuards(JwtAuthGuard)
@Roles(RolesEnum.merchant)
export class SubscriptionNetworkController extends AbstractController {
  constructor(
    private readonly subscriptionNetworkService: SubscriptionNetworkService,
  ) {
    super();
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: INVALID_CREDENTIALS_MESSAGE })
  @ApiResponse({ status: HttpStatus.OK, type: TokensResultModel, description: '' })
  @Acl({ microservice: MICROSERVICE, action: AclActionsEnum.read })
  public async getSubscriptionNetwork(
    @ParamModel(BUSINESS_ID, BusinessSchemaName, true) business: BusinessModel,
  ): Promise<SubscriptionNetworkModel[]> {
    return this.subscriptionNetworkService.getByBusiness(business);
  }

  @Get('/:subscriptionNetworkId')
  @HttpCode(HttpStatus.OK)
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: INVALID_CREDENTIALS_MESSAGE })
  @ApiResponse({ status: HttpStatus.OK, type: TokensResultModel, description: '' })
  @Acl({ microservice: MICROSERVICE, action: AclActionsEnum.read })
  public async getSubscriptionNetworkById(
    @ParamModel(':subscriptionNetworkId', SubscriptionNetworkSchemaName, true) 
    subscriptionNetwork: SubscriptionNetworkModel,
  ): Promise<AppWithAccessConfigDto> {
    return this.subscriptionNetworkService.appWithAccessConfig(subscriptionNetwork._id);
  }

  @Get('/default')
  @HttpCode(HttpStatus.OK)
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: INVALID_CREDENTIALS_MESSAGE })
  @ApiResponse({ status: HttpStatus.OK, type: TokensResultModel, description: '' })
  @Acl({ microservice: MICROSERVICE, action: AclActionsEnum.read })
  public async getDefaultSubscriptionNetwork(
    @ParamModel(BUSINESS_ID, BusinessSchemaName, true) business: BusinessModel,
  ): Promise<SubscriptionNetworkModel> {
    return this.subscriptionNetworkService.getDefault(business);
  }

  @Post()
  @HttpCode(HttpStatus.OK)
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: INVALID_CREDENTIALS_MESSAGE })
  @ApiResponse({ status: HttpStatus.OK, type: TokensResultModel, description: '' })
  @Acl({ microservice: MICROSERVICE, action: AclActionsEnum.create })
  public async createSubscriptionNetwork(
    @Body() createSubscriptionNetworkDto: SubscriptionNetworkDto,
    @ParamModel(BUSINESS_ID, BusinessSchemaName, true) business: BusinessModel,
  ): Promise<SubscriptionNetworkModel> {
    return this.subscriptionNetworkService.create(business, createSubscriptionNetworkDto);
  }

  @Patch('/:subscriptionNetworkId')
  @HttpCode(HttpStatus.OK)
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: INVALID_CREDENTIALS_MESSAGE })
  @ApiResponse({ status: HttpStatus.OK, type: TokensResultModel, description: '' })
  @Acl({ microservice: MICROSERVICE, action: AclActionsEnum.update })
  public async updateSubscriptionNetwork(
    @Body() updateSubscriptionNetworkDto: SubscriptionNetworkDto,
    @ParamModel(':subscriptionNetworkId', SubscriptionNetworkSchemaName, true) 
    subscriptionNetwork: SubscriptionNetworkModel,
    @ParamModel(BUSINESS_ID, BusinessSchemaName, true) business: BusinessModel,
  ): Promise<SubscriptionNetworkModel> {
    return this.subscriptionNetworkService.update(subscriptionNetwork, updateSubscriptionNetworkDto, business);
  }

  @Patch('/:subscriptionNetworkId/default')
  @HttpCode(HttpStatus.OK)
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: INVALID_CREDENTIALS_MESSAGE })
  @ApiResponse({ status: HttpStatus.OK, type: TokensResultModel, description: '' })
  @Acl({ microservice: MICROSERVICE, action: AclActionsEnum.update })
  public async setSubscriptionNetworkAsDefault(
    @ParamModel(BUSINESS_ID, BusinessSchemaName, true) business: BusinessModel,
    @ParamModel(':subscriptionNetworkId', SubscriptionNetworkSchemaName, true) 
    subscriptionNetwork: SubscriptionNetworkModel,
  ): Promise<SubscriptionNetworkModel> {
    return this.subscriptionNetworkService.setDefault(subscriptionNetwork._id, business._id);
  }

  @Delete('/:subscriptionNetworkId')
  @HttpCode(HttpStatus.OK)
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: INVALID_CREDENTIALS_MESSAGE })
  @ApiResponse({ status: HttpStatus.OK, type: TokensResultModel, description: '' })
  @Acl({ microservice: MICROSERVICE, action: AclActionsEnum.delete })
  public async deleteSubscriptionNetwork(
    @User() user: AccessTokenPayload,
    @ParamModel(':subscriptionNetworkId', SubscriptionNetworkSchemaName, true) 
    subscriptionNetwork: SubscriptionNetworkModel,
  ): Promise<void> {

    return this.subscriptionNetworkService.delete(subscriptionNetwork);
  }

  @Get('isValidName')
  @Roles(RolesEnum.merchant)
  @Acl({ microservice: MICROSERVICE, action: AclActionsEnum.read })
  public async isValidName(
    @ParamModel('businessId', BusinessSchemaName) business: BusinessModel,
    @Query() isValidNameDto: IsValidNameDto,
  ): Promise<ValidateSubscriptionNameResponseInterface> {
    return this.subscriptionNetworkService.isNetworkNameAvailable(isValidNameDto.name, business, null);
  }
}
