import { Body, Controller, Delete, Get, Param, Patch, Post, Query, UseGuards, ValidationPipe } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { ContinentDto, ContinentModel, ContinentSchemaName } from '@pe/common-sdk';
import { JwtAuthGuard, ParamModel, Roles, RolesEnum } from '@pe/nest-kit';
import { ListDto } from '../dto';
import { AdminContinentService } from '../services';
import { CONTINENT_PLACEHOLDER } from './constants';

@Controller('admin/continent')
@ApiTags('Continents admin API reference')
@UseGuards(JwtAuthGuard)
@Roles(RolesEnum.admin)
@ApiBearerAuth()
export class AdminContinentController {

  constructor(
    private readonly service: AdminContinentService,
  ) { }

  @Get(CONTINENT_PLACEHOLDER)
  public async getOne(
    @ParamModel({ '_id': CONTINENT_PLACEHOLDER }, ContinentSchemaName) continent: ContinentModel,
  ): Promise<ContinentModel> {
    return continent;
  }

  @Get('/list')
  public async getMany(
    @Query(new ValidationPipe({ transform: true })) dto: ListDto,
  ): Promise<{ page: number; total: number; continents: ContinentModel[] }> {
    return this.service.retrieveListForAdmin(dto);
  }

  @Post()
  public async create(
    @Body() dto: ContinentDto,
  ): Promise<ContinentModel> {
    return this.service.create(dto);
  }

  @Patch(CONTINENT_PLACEHOLDER)
  public async update(
    @Param('continentId') continentId: string,
    @Body() dto: Partial<ContinentDto>,
  ): Promise<ContinentModel> {
    return this.service.update(continentId, dto);
  }

  @Delete(CONTINENT_PLACEHOLDER)
  public async delete(
    @ParamModel({ '_id': CONTINENT_PLACEHOLDER }, ContinentSchemaName) continent: ContinentModel,
  ): Promise<ContinentModel> {
    return this.service.delete(continent);
  }

}
