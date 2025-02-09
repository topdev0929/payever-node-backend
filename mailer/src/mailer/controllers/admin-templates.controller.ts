import {
  Get, Post, Delete, Controller, Query, Patch,
  UseGuards, HttpCode, HttpStatus, Body,
} from '@nestjs/common';
import { TemplateModel } from '../models';
import { TemplateService } from '../services';
import { JwtAuthGuard, ParamModel, Roles, RolesEnum } from '@pe/nest-kit';
import { TemplateSchemaName } from '../schemas';
import { TemplateQueryDto } from '../dto/template';
import { ApiTags } from '@nestjs/swagger';
import { AdminTemplateDto } from '../dto/template/admin-template.dto';

const TEMPLATE_ID: string = ':templateId';
@Controller('admin/templates')
@UseGuards(JwtAuthGuard)
@Roles(RolesEnum.admin)
@ApiTags('admin site/templates')
export class AdminTemplatesController {
  constructor(
    private readonly templateService: TemplateService,
  ) { }

  @Get()
  public async getAll(
    @Query() query: TemplateQueryDto,
  ): Promise<any> {
    return this.templateService.getForAdmin(query);
  }

  @Get(TEMPLATE_ID)
  public async getById(
    @ParamModel(TEMPLATE_ID, TemplateSchemaName, true) template: TemplateModel,
  ): Promise<TemplateModel> {
    return template;
  }

  @Get(`${TEMPLATE_ID}/body`)
  public async getBodyById(
    @ParamModel(TEMPLATE_ID, TemplateSchemaName, true) template: TemplateModel,
  ): Promise<string> {
    return template.body;
  }

  @Post()
  @HttpCode(HttpStatus.OK)
  public async create(
    @Body() dto: AdminTemplateDto,
  ): Promise<TemplateModel> {
    return this.templateService.createForAdmin(dto);
  }

  @Patch(TEMPLATE_ID)
  public async update(
    @ParamModel(TEMPLATE_ID, TemplateSchemaName, true) template: TemplateModel,
    @Body() dto: AdminTemplateDto,
  ): Promise<TemplateModel> {
    return this.templateService.updateForAdmin(template._id, dto);
  }

  @Delete(TEMPLATE_ID)
  public async delete(
    @ParamModel(TEMPLATE_ID, TemplateSchemaName, true) template: TemplateModel,
  ): Promise<void> {
    await this.templateService.deleteById(template._id);
  }
}
