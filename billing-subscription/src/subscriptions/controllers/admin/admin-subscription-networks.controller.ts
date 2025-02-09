import {
  Body,
  Controller,
  Delete,
  HttpCode,
  HttpStatus,
  Post,
  Get,
  Patch,
  UseGuards,
  Query,
  NotFoundException,
} from '@nestjs/common';
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
import { BusinessSchemaName, BusinessService } from '@pe/business-kit';
import { BusinessModel } from '../../../business';
import { SubscriptionNetworkService } from '../../services';
import { SubscriptionNetworkModel } from '../../models';
import {
  SubscriptionNetworkDto,
  AppWithAccessConfigDto,
  IsValidNameDto,
  SubscriptionNetworkQueryDto,
  AdminSubscriptionNetworkCreateDto,
} from '../../dto';
import { SubscriptionNetworkSchemaName } from '../../schemas';
import { ValidateSubscriptionNameResponseInterface } from '../../interfaces';

const INVALID_CREDENTIALS_MESSAGE: string = 'Invalid credentials';
const MICROSERVICE: string = 'subscriptions';

@Controller('admin/subscription-networks')
@ApiTags('admin subscription-network')
@UseGuards(JwtAuthGuard)
@Roles(RolesEnum.admin)
export class AdminSubscriptionNetworksController extends AbstractController {
  constructor(
    private readonly subscriptionNetworkService: SubscriptionNetworkService,
    private readonly businessService: BusinessService,
  ) {
    super();
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: INVALID_CREDENTIALS_MESSAGE })
  @ApiResponse({ status: HttpStatus.OK, type: TokensResultModel, description: '' })
  public async getSubscriptionNetwork(
    @Query() query: SubscriptionNetworkQueryDto,
  ): Promise<any> {
    return this.subscriptionNetworkService.getForAdmin(query);
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

  @Get('business/:businessId/default')
  @HttpCode(HttpStatus.OK)
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: INVALID_CREDENTIALS_MESSAGE })
  @ApiResponse({ status: HttpStatus.OK, type: TokensResultModel, description: '' })
  @Acl({ microservice: MICROSERVICE, action: AclActionsEnum.read })
  public async getDefaultSubscriptionNetwork(
    @ParamModel(':businessId', BusinessSchemaName, true) business: BusinessModel,
  ): Promise<SubscriptionNetworkModel> {
    return this.subscriptionNetworkService.getDefault(business);
  }

  @Post()
  @HttpCode(HttpStatus.OK)
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: INVALID_CREDENTIALS_MESSAGE })
  @ApiResponse({ status: HttpStatus.OK, type: TokensResultModel, description: '' })
  @Acl({ microservice: MICROSERVICE, action: AclActionsEnum.create })
  public async createSubscriptionNetwork(
    @Body() createSubscriptionNetworkDto: AdminSubscriptionNetworkCreateDto,
  ): Promise<SubscriptionNetworkModel> {
    const businessId: string = createSubscriptionNetworkDto.businessId;
    const business: any = await this.businessService.findOneById(businessId);
    if (!business) {
      throw new NotFoundException(`business with id:'${businessId}' does not exist`);
    }

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
  ): Promise<SubscriptionNetworkModel> {
    const businessId: string = subscriptionNetwork.business as string;
    const business: any = await this.businessService.findOneById(businessId);
    if (!business) {
      throw new NotFoundException(`business with id:'${businessId}' does not exist`);
    }

    return this.subscriptionNetworkService.update(subscriptionNetwork, updateSubscriptionNetworkDto, business);
  }

  @Patch('/:subscriptionNetworkId/set-default')
  @HttpCode(HttpStatus.OK)
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: INVALID_CREDENTIALS_MESSAGE })
  @ApiResponse({ status: HttpStatus.OK, type: TokensResultModel, description: '' })
  @Acl({ microservice: MICROSERVICE, action: AclActionsEnum.update })
  public async setSubscriptionNetworkAsDefault(
    @ParamModel(':subscriptionNetworkId', SubscriptionNetworkSchemaName, true)
    subscriptionNetwork: SubscriptionNetworkModel,
  ): Promise<SubscriptionNetworkModel> {
    return this.subscriptionNetworkService.setDefault(subscriptionNetwork._id, subscriptionNetwork.business as string);
  }

  @Delete('/:subscriptionNetworkId')
  @HttpCode(HttpStatus.OK)
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: INVALID_CREDENTIALS_MESSAGE })
  @ApiResponse({ status: HttpStatus.OK, type: TokensResultModel, description: '' })
  @Acl({ microservice: MICROSERVICE, action: AclActionsEnum.delete })
  public async deleteSubscriptionNetwork(
    @ParamModel(':subscriptionNetworkId', SubscriptionNetworkSchemaName, true)
    subscriptionNetwork: SubscriptionNetworkModel,
  ): Promise<void> {
    return this.subscriptionNetworkService.delete(subscriptionNetwork);
  }

  @Get('business/:businessId/is-valid-name')
  @Roles(RolesEnum.merchant)
  @Acl({ microservice: MICROSERVICE, action: AclActionsEnum.read })
  public async isValidName(
    @ParamModel(':businessId', BusinessSchemaName, true) business: BusinessModel,
    @Query() isValidNameDto: IsValidNameDto,
  ): Promise<ValidateSubscriptionNameResponseInterface> {
    return this.subscriptionNetworkService.isNetworkNameAvailable(isValidNameDto.name, business, null);
  }
}
