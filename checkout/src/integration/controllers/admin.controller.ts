import { Body, ConflictException, Controller, Delete, Get, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

import { JwtAuthGuard, ParamModel, Roles, RolesEnum } from '@pe/nest-kit';
import { IntegrationSchemaName } from '../../mongoose-schema';
import { CreateIntegrationDto, UpdateIntegrationDto } from '../dto';
import { IntegrationModel } from '../models';
import { IntegrationService } from '../services';

@Controller('admin/integrations')
@ApiTags('admin')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Roles(RolesEnum.admin)
export class AdminIntegrationController {
  constructor(
    private readonly integrationService: IntegrationService,
  ) { }

  @Get()
  public async findAll(): Promise<IntegrationModel[]> {
    return this.integrationService.findAll();
  }

  @Get(':integrationName')
  public async findByName(
    @ParamModel({ name: ':integrationName'}, IntegrationSchemaName) integration: IntegrationModel,
    @Param('integrationName') swagger__integrationName: string,
  ): Promise<IntegrationModel> {
    return integration;
  }

  @Post()
  public async create(
    @Body() data: CreateIntegrationDto,
  ): Promise<IntegrationModel> {
    if (await this.integrationService.findOneByNameAndCategory(data.name, data.category)) {
      throw new ConflictException(`Integration already exists for category`);
    }

    return this.integrationService.create(data);
  }

  @Patch(':integrationId')
  public async update(
    @ParamModel(':integrationId', IntegrationSchemaName, true) integration: IntegrationModel,
    @Param('integrationId') swagger__integrationId: string,
    @Body() dto: UpdateIntegrationDto,
  ): Promise<IntegrationModel> {
    return this.integrationService.update(integration, dto);
  }

  @Delete(':integrationId')
  public async remove(
    @ParamModel(':integrationId', IntegrationSchemaName, true) integration: IntegrationModel,
    @Param('integrationId') swagger__integrationId: string,
  ): Promise<IntegrationModel> {
    return this.integrationService.remove(integration);
  }
}
