import { Body, Controller, Delete, Get, Param, Patch, Post, Query, UseGuards, ValidationPipe } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { CountryModel, CountrySchemaName } from '@pe/common-sdk';
import { JwtAuthGuard, ParamModel, Roles, RolesEnum } from '@pe/nest-kit';
import { CountryDto, ListDto } from '../dto';
import { AdminCountryService } from '../services';
import { COUNTRY_PLACEHOLDER } from './constants';

@Controller('admin/country')
@ApiTags('Countries admin API reference')
@UseGuards(JwtAuthGuard)
@Roles(RolesEnum.admin)
@ApiBearerAuth()
export class AdminCountryController {

  constructor(
    private readonly service: AdminCountryService,
  ) { }

  @Get(COUNTRY_PLACEHOLDER)
  public async getOne(
    @ParamModel({ '_id': COUNTRY_PLACEHOLDER }, CountrySchemaName) country: CountryModel,
  ): Promise<CountryModel> {
    return country;
  }

  @Get('/list')
  public async getMany(
    @Query(new ValidationPipe({ transform: true })) dto: ListDto,
  ): Promise<{ page: number; total: number; countries: CountryModel[] }> {
    return this.service.retrieveListForAdmin(dto);
  }

  @Post()
  public async create(
    @Body() dto: CountryDto,
  ): Promise<CountryModel> {
    return this.service.create(dto);
  }

  @Patch(COUNTRY_PLACEHOLDER)
  public async update(
    @Param('countryId') countryId: string,
    @Body() dto: Partial<CountryDto>,
  ): Promise<CountryModel> {
    return this.service.update(countryId, dto);
  }

  @Delete(COUNTRY_PLACEHOLDER)
  public async delete(
    @ParamModel({ '_id': COUNTRY_PLACEHOLDER }, CountrySchemaName) country: CountryModel,
  ): Promise<CountryModel> {
    return this.service.delete(country);
  }

}
