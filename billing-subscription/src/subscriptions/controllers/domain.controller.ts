import {
  Body,
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  UseGuards,
  Query,
} from '@nestjs/common';
import { ApiTags, ApiResponse, ApiOperation } from '@nestjs/swagger';
import {
  AbstractController,
  Acl,
  AclActionsEnum,
  JwtAuthGuard,
  Roles,
  RolesEnum,
  ParamModel,
} from '@pe/nest-kit';
import slugify from 'slugify';
import { EntityExistsException } from '../../common/exceptions';
import { SubscriptionNetworkModel, DomainModel, AccessConfigModel } from '../models';
import { CreateDomainDto, UpdateDomainDto } from '../dto';
import { SubscriptionNetworkSchemaName, DomainSchemaName, AccessConfigSchemaName } from '../schemas';
import { AccessConfigService, DomainService } from '../services';
import { DomainCheckInterface } from '../interfaces';
import { environment } from '../../environments';

const BUSINESS_ID_PLACEHOLDER: string = ':businessId';
const SUBSCRIPTION_NETWORK_PLACEHOLDER: string = ':subscriptionNetworkId';
const MICROSERVICE: string = 'subscriptions';

@Controller('business/:businessId/domain')
@ApiTags('domains')
@UseGuards(JwtAuthGuard)
@Roles(RolesEnum.merchant)
export class DomainController extends AbstractController {
  constructor(
    private readonly domainService: DomainService,
    private readonly accessConfigService: AccessConfigService,
  ) {
    super();
  }

  @Get(SUBSCRIPTION_NETWORK_PLACEHOLDER)
  @Acl({ microservice: MICROSERVICE, action: AclActionsEnum.read })
  @ApiOperation({
    description: 'Getting domains by business id',
  })
  @ApiResponse({
    description: 'Return domains',
    isArray: true,
    status: 200,
  })
  @ApiTags('list')
  public async getDomainsNetwork(
    @ParamModel(SUBSCRIPTION_NETWORK_PLACEHOLDER, SubscriptionNetworkSchemaName) 
    subscriptionNetwork: SubscriptionNetworkModel,
  ): Promise<DomainModel[]> {
    return this.domainService.findByNetwork(subscriptionNetwork.id);
  }

  @Post(SUBSCRIPTION_NETWORK_PLACEHOLDER)
  @Acl({ microservice: MICROSERVICE, action: AclActionsEnum.create })
  @ApiOperation({
    description: 'Adding new domain for business',
  })
  @ApiResponse({
    description: 'Returns domain',
    status: 201,
  })
  @ApiTags('create')
  public async createDomain(
    @ParamModel(':subscriptionNetworkId', SubscriptionNetworkSchemaName) subscriptionNetwork: SubscriptionNetworkModel,
    @Body() dto: CreateDomainDto,
  ): Promise<DomainModel> {
    return this.domainService.create(subscriptionNetwork, dto);
  }

  @Patch(`${SUBSCRIPTION_NETWORK_PLACEHOLDER}/:domainId`)
  @Acl({ microservice: MICROSERVICE, action: AclActionsEnum.update })
  @ApiOperation({
    description: 'Updating domain info',
  })
  @ApiResponse({
    description: 'Returns domain',
    status: 200,
  })
  @ApiTags('update')
  public async updateDomain(
    @ParamModel(':domainId', DomainSchemaName) domain: DomainModel,
    @Body() payload: UpdateDomainDto,
  ): Promise<DomainModel> {
    return this.domainService.update(domain, payload);
  }

  @Delete(`${SUBSCRIPTION_NETWORK_PLACEHOLDER}/:domainId`)
  @Acl({ microservice: MICROSERVICE, action: AclActionsEnum.delete })
  @ApiOperation({
    description: 'Delete subscription network\'s domain',
  })
  @ApiTags('delete')
  public async deleteDomain(
    @ParamModel(':domainId', DomainSchemaName) domain: DomainModel,
  ): Promise<void> {
    await this.domainService.delete(domain);
  }

  @Post(`${SUBSCRIPTION_NETWORK_PLACEHOLDER}/:domainId/check`)
  @Acl({ microservice: MICROSERVICE, action: AclActionsEnum.create })
  @ApiOperation({
    description: 'Checking domain\'s dns records',
  })
  public async checkDomainStatus(
    @ParamModel(':domainId', DomainSchemaName) domain: DomainModel,
  ): Promise<DomainCheckInterface> {
    return this.domainService.checkStatus(domain);
  }

  @Get(`${SUBSCRIPTION_NETWORK_PLACEHOLDER}/isValidName`)
  @Acl({ microservice: MICROSERVICE, action: AclActionsEnum.read })
  @Roles(RolesEnum.anonymous)
  public async isValidName(
    @ParamModel(
      {
        business: BUSINESS_ID_PLACEHOLDER,
        subscriptionNetwork: SUBSCRIPTION_NETWORK_PLACEHOLDER,
      },
      AccessConfigSchemaName,
    ) accessConfig: AccessConfigModel,
    @Query('name') name: string,
  ): Promise<{
    result: boolean;
    message?: string;
  }> {
    if (!name) {
      throw new Error(`Query param "name" is required`);
    }

    try {
      const domain: string = slugify(name).toLowerCase();
      if (await this.accessConfigService.isDomainOccupied(domain, accessConfig.businessId)) {
        throw new EntityExistsException(
          `Domain "${domain}" already exists"`,
        );
      }

      return { result: true };
    } catch (e) {
      return {
        message: (e && e.message) ? e.message : '',
        result: false,
      };
    }
  }
}
