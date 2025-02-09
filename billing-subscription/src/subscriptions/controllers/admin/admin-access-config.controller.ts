import { Body, Controller, Get, Patch, Param, Post, UseGuards } from '@nestjs/common';
import {
  AbstractController,
  ParamModel,
  Roles,
  RolesEnum,
  JwtAuthGuard,
} from '@pe/nest-kit';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { DomainCheckInterface } from '../../interfaces/domain-check.interface';
import { AccessConfigSchemaName, SubscriptionNetworkSchemaName } from '../../schemas';
import { AccessConfigService } from '../../services';
import { AccessConfigModel, SubscriptionNetworkModel } from '../../models';
import { BusinessModel } from '../../../business';
import { BusinessSchemaName } from '@pe/business-kit';
import { AdminUpdateAccessConfigCreateDto } from '../../dto';



@Controller('admin/subscription-network/access/:subscriptionNetworkId')
@ApiTags('admin subscription-network-access')
@UseGuards(JwtAuthGuard)
@Roles(RolesEnum.admin)
export class AdminAccessConfigController extends AbstractController {
  constructor(
    private readonly accessConfigService: AccessConfigService,
  ) {
    super();
  }

  @Patch()
  @ApiOperation({
    description: 'Updating access config',
  })
  public async updateAccessConfig(
    @ParamModel(':subscriptionNetworkId', SubscriptionNetworkSchemaName, true) 
    subscriptionNetwork: SubscriptionNetworkModel,    
    @Body() updateAccessConfigDto: AdminUpdateAccessConfigCreateDto,
  ): Promise<AccessConfigModel> {
    return this.accessConfigService.createOrUpdate(subscriptionNetwork, updateAccessConfigDto);
  }

  @Get('business/:businessId')
  @ApiOperation({
    description: 'Is accessConfig live',
  })
  public async getConfig(
    @ParamModel(':businessId', BusinessSchemaName) business: BusinessModel,
    @ParamModel(':subscriptionNetworkId', SubscriptionNetworkSchemaName, true) 
    subscriptionNetwork: SubscriptionNetworkModel): Promise<AccessConfigModel> {
    return this.accessConfigService.findOrCreate(business._id, subscriptionNetwork);
  }

  @Get('business/:businessId/is-live')
  @ApiOperation({
    description: 'Is accessConfig live',
  })
  public async getIsLiveStatus(
    @ParamModel(
      {
        business: ':businessId',
        subscriptionNetwork: ':subscriptionNetworkId',
      },
      AccessConfigSchemaName,
    ) accessConfig: AccessConfigModel,
  ): Promise<boolean> {
    return accessConfig.isLive;
  }

  @Post('business/:businessId/domain/check')
  @ApiOperation({
    description: 'Checking own domain\'s dns records',
  })
  public async checkStatus(
    @ParamModel(
      {
        business: ':businessId',
        subscriptionNetwork: ':subscriptionNetworkId',
      },
      AccessConfigSchemaName,
    ) accessConfig: AccessConfigModel,
  ): Promise<DomainCheckInterface> {
    return this.accessConfigService.checkStatus(accessConfig);
  }
}
