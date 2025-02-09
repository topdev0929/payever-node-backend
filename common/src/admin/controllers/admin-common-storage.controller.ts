import { Body, Controller, Delete, Get, Param, Patch, Post, Query, UseGuards, ValidationPipe } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { CommonStorageDto, CommonStorageModel, CommonStorageSchemaName } from '@pe/common-sdk';
import { JwtAuthGuard, ParamModel, Roles, RolesEnum } from '@pe/nest-kit';
import { ListDto } from '../dto';
import { AdminCommonStorageService } from '../services';
import { COMMON_STORAGE_PLACEHOLDER } from './constants';

@Controller('admin/common-storage')
@ApiTags('Common Storage admin API reference')
@UseGuards(JwtAuthGuard)
@Roles(RolesEnum.admin)
@ApiBearerAuth()
export class AdminCommonStorageController {

  constructor(
    private readonly service: AdminCommonStorageService,
  ) { }

  @Get(COMMON_STORAGE_PLACEHOLDER)
  public async getOne(
    @ParamModel(
      { '_id': COMMON_STORAGE_PLACEHOLDER },
      CommonStorageSchemaName,
    ) commonStorage: CommonStorageModel,
  ): Promise<CommonStorageModel> {
    return commonStorage;
  }

  @Get('/list')
  public async getMany(
    @Query(new ValidationPipe({ transform: true })) dto: ListDto,
  ): Promise<{ page: number; total: number; commonStorage: CommonStorageModel[] }> {
    return this.service.retrieveListForAdmin(dto);
  }

  @Post()
  public async create(
    @Body() dto: CommonStorageDto,
  ): Promise<CommonStorageModel> {
    return this.service.create(dto);
  }

  @Patch(COMMON_STORAGE_PLACEHOLDER)
  public async update(
    @ParamModel(
      { '_id': COMMON_STORAGE_PLACEHOLDER },
      CommonStorageSchemaName,
    ) commonStorage: CommonStorageModel,
    @Body() dto: Partial<CommonStorageDto>,
  ): Promise<CommonStorageModel> {
    return this.service.update(commonStorage.id, dto);
  }

  @Delete(COMMON_STORAGE_PLACEHOLDER)
  public async delete(
    @ParamModel(
      { '_id': COMMON_STORAGE_PLACEHOLDER },
      CommonStorageSchemaName,
    ) commonStorage: CommonStorageModel,
  ): Promise<CommonStorageModel> {
    return this.service.delete(commonStorage);
  }

}
