import { Body, Controller, Delete, Get, Put, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ParamModel } from '@pe/nest-kit';
import { JwtAuthGuard, Roles, RolesEnum } from '@pe/nest-kit/modules/auth';
import { TemplateMessageDto } from '../dto';
import { TemplateModel } from '../models';
import { TemplateService } from '../services';

@Controller('template')
@ApiTags('template')
@UseGuards(JwtAuthGuard)
export class TemplateController {
  constructor(
    private readonly templateService: TemplateService,
  ) { }

  @Put()
  @Roles(RolesEnum.admin)
  public async add(
    @Body() templateDto: TemplateMessageDto,
  ): Promise<TemplateModel> {
    return this.templateService.create(templateDto);
  }

  @Get()
  @Roles(RolesEnum.anonymous)
  public async findAll(): Promise<TemplateModel[]> {
    return this.templateService.findAll();
  }

  @Get('/:id')
  @Roles(RolesEnum.anonymous)
  public async findById(
    @ParamModel('id', 'Template') template: TemplateModel,
  ): Promise<TemplateModel> {
    return template;
  }

  @Get('/name/:name')
  @Roles(RolesEnum.anonymous)
  public async findByName(
    @ParamModel({ name: ':name' }, 'Template') template: TemplateModel,
  ): Promise<TemplateModel> {
    return template;
  }

  @Delete('/:id')
  @Roles(RolesEnum.admin)
  public async removeById(
    @ParamModel('id', 'Template') template: TemplateModel,
  ): Promise<void> {
    await this.templateService.removeById(template.id);
  }

  @Delete('/name/:name')
  @Roles(RolesEnum.admin)
  public async removeByName(
    @ParamModel({ name: ':name' }, 'Template') template: TemplateModel,
  ): Promise<void> {
    await this.templateService.removeByName(template.name);
  }
}
