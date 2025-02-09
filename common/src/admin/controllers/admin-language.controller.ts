import { Body, Controller, Delete, Get, Param, Patch, Post, Query, UseGuards, ValidationPipe } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { LanguageDto, LanguageModel, LanguageSchemaName } from '@pe/common-sdk';
import { JwtAuthGuard, ParamModel, Roles, RolesEnum } from '@pe/nest-kit';
import { ListDto } from '../dto';
import { AdminLanguageService } from '../services';
import { LANGUAGE_PLACEHOLDER } from './constants';

@Controller('admin/language')
@ApiTags('Languages admin API reference')
@UseGuards(JwtAuthGuard)
@Roles(RolesEnum.admin)
@ApiBearerAuth()
export class AdminLanguageController {

  constructor(
    private readonly service: AdminLanguageService,
  ) { }

  @Get(LANGUAGE_PLACEHOLDER)
  public async getOne(
    @ParamModel({ '_id': LANGUAGE_PLACEHOLDER }, LanguageSchemaName) language: LanguageModel,
  ): Promise<LanguageModel> {
    return language;
  }

  @Get('/list')
  public async getMany(
    @Query(new ValidationPipe({ transform: true })) dto: ListDto,
  ): Promise<{ page: number; total: number; languages: LanguageModel[] }> {
    return this.service.retrieveListForAdmin(dto);
  }

  @Post()
  public async create(
    @Body() dto: LanguageDto,
  ): Promise<LanguageModel> {
    return this.service.create(dto);
  }

  @Patch(LANGUAGE_PLACEHOLDER)
  public async update(
    @Param('languageId') languageId: string,
    @Body() dto: Partial<LanguageDto>,
  ): Promise<LanguageModel> {
    return this.service.update(languageId, dto);
  }

  @Delete(LANGUAGE_PLACEHOLDER)
  public async delete(
    @ParamModel({ '_id': LANGUAGE_PLACEHOLDER }, LanguageSchemaName) language: LanguageModel,
  ): Promise<LanguageModel> {
    return this.service.delete(language);
  }

}
