import { Body, Controller, Get, Patch, Post, Delete, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Acl, AclActionsEnum, JwtAuthGuard, ParamModel, Roles, RolesEnum } from '@pe/nest-kit';
import { BusinessModel } from '../../business/models';
import { BusinessSchemaName, LocationSchemaName } from '../../environments/mongoose-schema.names';
import { CreateLocationDto, UpdateLocationDto } from '../dto/location';
import { LocationModel } from '../models';
import { LocationService } from '../services';

const BUSINESS_ID_PLACEHOLDER: string = ':businessId';
const LOCATION_ID_PLACEHOLDER: string = ':locationId';

@Controller('business/:businessId/location')
@ApiTags('business inventory')
@Roles(RolesEnum.merchant)
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class LocationController {
  constructor(
    private readonly locationService: LocationService,
  ) { }

  @Get()
  @Roles(RolesEnum.merchant)
  @Acl({ microservice: 'products', action: AclActionsEnum.read })
  public async get(
    @ParamModel(BUSINESS_ID_PLACEHOLDER, BusinessSchemaName) business: BusinessModel,
  ): Promise<LocationModel[]> {
    return this.locationService.findAllByBusiness(business);
  }

  @Post()
  @Acl({ microservice: 'products', action: AclActionsEnum.create })
  public async create(
    @ParamModel(BUSINESS_ID_PLACEHOLDER, BusinessSchemaName) business: BusinessModel,
    @Body() dto: CreateLocationDto,
  ): Promise<LocationModel> {
    return this.locationService.create(
      business,
      dto,
    );
  }

  @Patch(':locationId')
  @Acl({ microservice: 'products', action: AclActionsEnum.update })
  public async change(
    @ParamModel(
      {
        _id: LOCATION_ID_PLACEHOLDER,
        businessId: BUSINESS_ID_PLACEHOLDER,
      },
      LocationSchemaName,
    ) location: LocationModel,
    @Body() dto: UpdateLocationDto,
  ): Promise<LocationModel> {
    return this.locationService.update(
      location,
      dto,
    );
  }

  @Delete(':locationId')
  @Acl({ microservice: 'products', action: AclActionsEnum.delete })
  public async delete(
    @ParamModel(
      {
        _id: LOCATION_ID_PLACEHOLDER,
        businessId: BUSINESS_ID_PLACEHOLDER,
      },
      LocationSchemaName,
    ) location: LocationModel,
  ): Promise<void> {
    await this.locationService.delete(location);
  }
}
