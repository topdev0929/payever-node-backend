import {
  Get, Post, Delete, Controller, Query, Patch,
  UseGuards, HttpCode, HttpStatus, Body,
} from '@nestjs/common';
import { JwtAuthGuard, ParamModel, Roles, RolesEnum } from '@pe/nest-kit';
import { ApiTags } from '@nestjs/swagger';
import { AdminMimeTypeDto, MimeTypeModel, MimeTypeQueryDto, MimeTypeSchemaName, MimeTypeService } from '../../media';


const MIME_TYPE_ID: string = ':mimeTypeId';


@Controller('admin/mime-types')
@UseGuards(JwtAuthGuard)
@Roles(RolesEnum.admin)
@ApiTags('Admin Mime-types')
export class AdminMimeTypesController {
  constructor(
    private readonly mimeTypeService: MimeTypeService,
  ) { }

  @Get()
  public async getAll(
    @Query() query: MimeTypeQueryDto,
  ): Promise<any> {
    return this.mimeTypeService.getForAdmin(query);
  }

  @Get(MIME_TYPE_ID)
  public async getById(
    @ParamModel(MIME_TYPE_ID, MimeTypeSchemaName, true) mimeType: MimeTypeModel,
  ): Promise<MimeTypeModel> {
    return mimeType;
  }

  @Get(`key/:key`)
  public async getByKey(
    @ParamModel({ key: 'key' }, MimeTypeSchemaName, true) mimeType: MimeTypeModel,
  ): Promise<MimeTypeModel> {
    return mimeType;
  }

  @Post()
  @HttpCode(HttpStatus.OK)
  public async create(
    @Body() dto: AdminMimeTypeDto,
  ): Promise<MimeTypeModel> {
    return this.mimeTypeService.createForAdmin(dto);
  }

  @Patch(MIME_TYPE_ID)
  @HttpCode(HttpStatus.OK)
  public async update(
    @ParamModel(MIME_TYPE_ID, MimeTypeSchemaName, true) channel: MimeTypeModel,
    @Body() dto: AdminMimeTypeDto,
  ): Promise<MimeTypeModel> {
    return this.mimeTypeService.updateForAdmin(channel._id, dto);
  }

  @Delete(MIME_TYPE_ID)
  @HttpCode(HttpStatus.OK)
  public async delete(
    @ParamModel(MIME_TYPE_ID, MimeTypeSchemaName, true) channel: MimeTypeModel,
  ): Promise<void> {
    await this.mimeTypeService.deleteById(channel._id);
  }
}
