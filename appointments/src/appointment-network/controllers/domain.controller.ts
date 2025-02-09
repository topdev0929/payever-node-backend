import {
  Body,
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  UseGuards,
  Query,
  BadRequestException,
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
import { EntityExistsException } from '../common/exceptions';
import { AppointmentNetworkModel, DomainModel, AccessConfigModel } from '../models';
import { CreateDomainDto, UpdateDomainDto } from '../dto';
import { AppointmentNetworkSchemaName, DomainSchemaName, AccessConfigSchemaName } from '../schemas';
import { AccessConfigService, DomainService } from '../services';
import { DomainCheckInterface } from '../interfaces';

const BUSINESS_ID_PLACEHOLDER: string = ':businessId';
const APPOINTMENT_NETWORK_PLACEHOLDER: string = ':appointmentNetworkId';
const MICROSERVICE: string = 'appointment';

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

  @Get(APPOINTMENT_NETWORK_PLACEHOLDER)
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
    @ParamModel(APPOINTMENT_NETWORK_PLACEHOLDER, AppointmentNetworkSchemaName) 
    appointmentNetwork: AppointmentNetworkModel,
  ): Promise<DomainModel[]> {
    return this.domainService.findByNetwork(appointmentNetwork.id);
  }

  @Post(APPOINTMENT_NETWORK_PLACEHOLDER)
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
    @ParamModel(':appointmentNetworkId', AppointmentNetworkSchemaName) appointmentNetwork: AppointmentNetworkModel,
    @Body() dto: CreateDomainDto,
  ): Promise<DomainModel> {
    return this.domainService.create(appointmentNetwork, dto);
  }

  @Patch(`${APPOINTMENT_NETWORK_PLACEHOLDER}/:domainId`)
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

  @Delete(`${APPOINTMENT_NETWORK_PLACEHOLDER}/:domainId`)
  @Acl({ microservice: MICROSERVICE, action: AclActionsEnum.delete })
  @ApiOperation({
    description: 'Delete appointment network\'s domain',
  })
  @ApiTags('delete')
  public async deleteDomain(
    @ParamModel(':domainId', DomainSchemaName) domain: DomainModel,
  ): Promise<void> {
    await this.domainService.delete(domain);
  }

  @Post(`${APPOINTMENT_NETWORK_PLACEHOLDER}/:domainId/check`)
  @Acl({ microservice: MICROSERVICE, action: AclActionsEnum.create })
  @ApiOperation({
    description: 'Checking domain\'s dns records',
  })
  public async checkDomainStatus(
    @ParamModel(':domainId', DomainSchemaName) domain: DomainModel,
  ): Promise<DomainCheckInterface> {
    return this.domainService.checkStatus(domain);
  }

  @Get(`${APPOINTMENT_NETWORK_PLACEHOLDER}/isValidName`)
  @Acl({ microservice: MICROSERVICE, action: AclActionsEnum.read })
  @Roles(RolesEnum.anonymous)
  public async isValidName(
    @ParamModel(
      {
        appointmentNetwork: APPOINTMENT_NETWORK_PLACEHOLDER,
        business: BUSINESS_ID_PLACEHOLDER,
      },
      AccessConfigSchemaName,
    ) accessConfig: AccessConfigModel,
    @Query('name') name: string,
  ): Promise<{
    result: boolean;
    message?: string;
  }> {
    if (!name) {
      throw new BadRequestException(`Query param "name" is required`);
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
