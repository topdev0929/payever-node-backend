import { Body, Controller, Get, Patch, Post, Delete, UseGuards, HttpCode, HttpStatus, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Acl, AclActionsEnum, JwtAuthGuard, ParamModel, Roles, RolesEnum } from '@pe/nest-kit';
import { BusinessModel } from '../../business/models';
import { BusinessSchemaName, LocationSchemaName } from '../../environments/mongoose-schema.names';
import { AdminLocationDto, CreateLocationDto, LocationQueryDto, UpdateLocationDto } from '../dto/location';
import { LocationModel } from '../models';
import { LocationService } from '../services';

const BUSINESS_ID_PLACEHOLDER: string = ':businessId';
const LOCATION_ID: string = ':locationId';

@Controller('admin/locations')
@ApiTags('admin locations')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
@Roles(RolesEnum.admin)
export class AdminLocationsController {
  constructor(
    private readonly locationService: LocationService,
  ) { }

  @Get()
  @HttpCode(HttpStatus.OK)
  public async getAll(
    @Query() query: LocationQueryDto,
  ): Promise<any> {
    return this.locationService.getForAdmin(query);
  }

  @Get(LOCATION_ID)
  @HttpCode(HttpStatus.OK)
  public async getById(
    @ParamModel(LOCATION_ID, LocationSchemaName) location: LocationModel,
  ): Promise<LocationModel> {
    return location;
  }

  @Post()
  @HttpCode(HttpStatus.OK)
  public async create(    
    @Body() adminLocationDto: AdminLocationDto,
  ): Promise<LocationModel> {
    return this.locationService.createForAdmin(adminLocationDto);
  }

  @Patch(LOCATION_ID)
  @HttpCode(HttpStatus.OK)
  public async update(
    @ParamModel(LOCATION_ID, LocationSchemaName) location: LocationModel,
    @Body() adminLocationDto: AdminLocationDto,
  ): Promise<LocationModel> {
    return this.locationService.updateForAdmin(location._id, adminLocationDto);
  }

  @Delete(LOCATION_ID)
  public async delete(
    @ParamModel(LOCATION_ID, LocationSchemaName) location: LocationModel,
  ): Promise<void> {
    await this.locationService.delete(location);
  }
}
