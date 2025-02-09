import {
  BadRequestException, Body, Controller, Delete, Get, HttpCode, HttpStatus, Patch,
  Query, UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard, ParamModel, Roles, RolesEnum } from '@pe/nest-kit';
import { BusinessModelLocal, BusinessSchemaName } from '../../business';
import { BusinessQueryDto } from '../dto';
import { BusinessServiceLocal } from '../services';

@Controller('admin/businesses')
@ApiTags('admin businesses')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
@Roles(RolesEnum.admin)
@ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Invalid authorization token.' })
@ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Unauthorized.' })
export class AdminBusinessesController {
  constructor(
    private readonly businessService: BusinessServiceLocal,
  ) { }

  @Get()
  @HttpCode(HttpStatus.OK)
  public async getBusinesses(
    @Query() query: BusinessQueryDto,
  ): Promise<any> {
    return this.businessService.getForAdmin(query);
  }

  @Get(':businessId')
  @HttpCode(HttpStatus.OK)
  public async getIntegrationById(
    @ParamModel(':businessId', BusinessSchemaName, true)
    business: BusinessModelLocal,
  ): Promise<BusinessModelLocal> {
    return business;
  }

  @Patch(':businessId/excluded-integrations')
  @HttpCode(HttpStatus.OK)
  public async addExcludedIntegrations(
    @Body() excludedIntegrationsIds: string[],
    @ParamModel(':businessId', BusinessSchemaName, true)
    business: BusinessModelLocal,
  ): Promise<string[]> {

    if (!excludedIntegrationsIds || excludedIntegrationsIds.length === 0) {
      throw new BadRequestException(
        'Please specify an array of excludedIntegrationsIds',
      );
    }

    return (
      await this.businessService.addExcludedIntegrations(
        business,
        excludedIntegrationsIds,
      )
    ).excludedIntegrations;
  }

  @Delete(':businessId/excluded-integrations')
  @HttpCode(HttpStatus.OK)
  public async removeExcludedIntegrations(
    @Body() excludedIntegrationsIds: string[],
    @ParamModel(':businessId', BusinessSchemaName, true)
    business: BusinessModelLocal,
  ): Promise<string[]> {

    if (!excludedIntegrationsIds || excludedIntegrationsIds.length === 0) {
      throw new BadRequestException(
        'Please specify an array of excludedIntegrationsIds',
      );
    }

    return (
      await this.businessService.removeExcludedIntegrations(
        business,
        excludedIntegrationsIds,
      )
    ).excludedIntegrations;
  }
}
