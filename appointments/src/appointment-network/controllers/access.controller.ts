import { Body, Controller, Get, Patch, Post } from '@nestjs/common';
import {
  AbstractController,
  Acl,
  AclActionsEnum,
  ParamModel,
  Roles,
  RolesEnum,
} from '@pe/nest-kit';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { UpdateAccessConfigDto } from '../dto';
import { DomainCheckInterface } from '../interfaces/domain-check.interface';
import { AccessConfigSchemaName, AppointmentNetworkSchemaName } from '../schemas';
import { AccessConfigService } from '../services';
import { AccessConfigModel, AppointmentNetworkModel, BusinessModel } from '../models';
import { BusinessSchemaName } from '@pe/business-kit';

const BUSINESS_PLACEHOLDER: string = ':businessId';
const APPOINTMENT_NETWORK_PLACEHOLDER: string = ':appointmentNetworkId';
const ACCESS_CONFIG_PLACEHOLDER: string = ':id';
const MICROSERVICE: string = 'appointment';

@Controller('business/:businessId/appointment-network/access/:appointmentNetworkId')
@ApiTags('appointment-network-access')
@Roles(RolesEnum.merchant)
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
    @ParamModel(APPOINTMENT_NETWORK_PLACEHOLDER, AppointmentNetworkSchemaName, true)
    appointmentNetwork: AppointmentNetworkModel,
    @Body() dto: UpdateAccessConfigDto,
  ): Promise<AccessConfigModel> {
    return this.accessConfigService.createOrUpdate(appointmentNetwork, dto);
  }

  @Get()
  @Acl({ microservice: MICROSERVICE, action: AclActionsEnum.read })
  @ApiOperation({
    description: 'Is accessConfig live',
  })
  public async getConfig(
    @ParamModel(BUSINESS_PLACEHOLDER, BusinessSchemaName) business: BusinessModel,
    @ParamModel(APPOINTMENT_NETWORK_PLACEHOLDER, AppointmentNetworkSchemaName, true)
    appointmentNetwork: AppointmentNetworkModel): Promise<AccessConfigModel> {
    return this.accessConfigService.findOrCreate(business._id, appointmentNetwork);
  }

  @Get('is-live')
  @Acl({ microservice: MICROSERVICE, action: AclActionsEnum.read })
  @ApiOperation({
    description: 'Is accessConfig live',
  })
  public async getIsLiveStatus(
    @ParamModel(
      {
        appointmentNetwork: APPOINTMENT_NETWORK_PLACEHOLDER,
        business: BUSINESS_PLACEHOLDER,
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
        appointmentNetwork: APPOINTMENT_NETWORK_PLACEHOLDER,
        business: BUSINESS_PLACEHOLDER,
      },
      AccessConfigSchemaName,
    ) accessConfig: AccessConfigModel,
  ): Promise<DomainCheckInterface> {
    return this.accessConfigService.checkStatus(accessConfig);
  }
}
