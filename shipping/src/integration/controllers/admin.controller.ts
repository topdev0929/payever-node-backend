import { Body, Controller, UseGuards, Patch, HttpException, Post, Delete } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard, Roles, RolesEnum, ParamModel } from '@pe/nest-kit';
import { CreateIntegrationDto } from '../dto';

import { IntegrationModel } from '../models';
import { IntegrationService } from '../services';

@ApiBearerAuth()
@Controller('admin')
@UseGuards(JwtAuthGuard)
@ApiTags('admin')
@Roles(RolesEnum.admin)
export class AdminController {
  constructor(
    private readonly integrationService: IntegrationService,
  ) { }

  @Patch('integration/:id')
  public async edit(
    @ParamModel(':id', 'Integration', true) integration: IntegrationModel,
    @Body() dto: CreateIntegrationDto,
  ): Promise<IntegrationModel> {
    return this.integrationService.update(integration._id, dto);
  }

  @Post('integration')
  public async create(
    @Body() data: CreateIntegrationDto,
  ): Promise<IntegrationModel> {
    if (await this.integrationService.findOneByName(data.name)) {
      throw new HttpException(`Integration already exists for category`, 400);
    }

    return this.integrationService.create(data);
  }

  @Delete('integration/:id')
  public async delete(
    @ParamModel(':id', 'Integration', true) integration: IntegrationModel,
  ): Promise<void> {
    await this.integrationService.delete(integration._id);
  }
}
