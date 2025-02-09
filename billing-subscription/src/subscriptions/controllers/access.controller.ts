import { Body, Controller, Get, Patch, Param, Post } from '@nestjs/common';
import {
  AbstractController,
  Acl,
  AclActionsEnum,
  ParamModel,
} from '@pe/nest-kit';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { UpdateAccessConfigDto } from '../dto';
import { DomainCheckInterface } from '../interfaces/domain-check.interface';
import { AccessConfigSchemaName, SubscriptionNetworkSchemaName } from '../schemas';
import { AccessConfigService } from '../services';
import { AccessConfigModel, SubscriptionNetworkModel } from '../models';
import { environment } from '../../environments';
import { BusinessModel } from '../../business';
import { BusinessSchemaName } from '@pe/business-kit';

const BUSINESS_PLACEHOLDER: string = ':businessId';
const SUBSCRIPTION_NETWORK_PLACEHOLDER: string = ':subscriptionNetworkId';
const ACCESS_CONFIG_PLACEHOLDER: string = ':id';
const MICROSERVICE: string = 'subscriptions';

@Controller('business/:businessId/subscription-network/access/:subscriptionNetworkId')
@ApiTags('subscription-network-access')
export class AccessController extends AbstractController {
  constructor(
    private readonly accessConfigService: AccessConfigService,
  ) {
    super();
  }

  @Patch(ACCESS_CONFIG_PLACEHOLDER)
  @Acl({ microservice: MICROSERVICE, action: AclActionsEnum.update })
  @ApiOperation({
    description: 'Updating access config',
  })
  public async updateAccessConfig(
    @ParamModel(SUBSCRIPTION_NETWORK_PLACEHOLDER, SubscriptionNetworkSchemaName, true) 
    subscriptionNetwork: SubscriptionNetworkModel,
    @Body() dto: UpdateAccessConfigDto,
  ): Promise<AccessConfigModel> {
    return this.accessConfigService.createOrUpdate(subscriptionNetwork, dto);
  }

  @Get()
  @Acl({ microservice: MICROSERVICE, action: AclActionsEnum.read })
  @ApiOperation({
    description: 'Is accessConfig live',
  })
  public async getConfig(
    @ParamModel(BUSINESS_PLACEHOLDER, BusinessSchemaName) business: BusinessModel,
    @ParamModel(SUBSCRIPTION_NETWORK_PLACEHOLDER, SubscriptionNetworkSchemaName, true) 
    subscriptionNetwork: SubscriptionNetworkModel): Promise<AccessConfigModel> {
    return this.accessConfigService.findOrCreate(business._id, subscriptionNetwork);
  }

  @Get('is-live')
  @Acl({ microservice: MICROSERVICE, action: AclActionsEnum.read })
  @ApiOperation({
    description: 'Is accessConfig live',
  })
  public async getIsLiveStatus(
    @ParamModel(
      {
        business: BUSINESS_PLACEHOLDER,
        subscriptionNetwork: SUBSCRIPTION_NETWORK_PLACEHOLDER,
      },
      AccessConfigSchemaName,
    ) accessConfig: AccessConfigModel,
  ): Promise<boolean> {
    return accessConfig.isLive;
  }

  @Post('domain/check')
  @Acl({ microservice: MICROSERVICE, action: AclActionsEnum.create })
  @ApiOperation({
    description: 'Checking own domain\'s dns records',
  })
  public async checkStatus(
    @ParamModel(
      {
        business: BUSINESS_PLACEHOLDER,
        subscriptionNetwork: SUBSCRIPTION_NETWORK_PLACEHOLDER,
      },
      AccessConfigSchemaName,
    ) accessConfig: AccessConfigModel,
  ): Promise<DomainCheckInterface> {
    return this.accessConfigService.checkStatus(accessConfig);
  }
}
