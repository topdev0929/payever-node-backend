import { Body, Controller, UseGuards, Patch } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard, Roles, RolesEnum, ParamModel } from '@pe/nest-kit';

import { EditIntegrationDto } from '../dto';
import { IntegrationModel } from '../models';
import { IntegrationService } from '../services';

@ApiBearerAuth()
@Controller('integrations-management')
@UseGuards(JwtAuthGuard)
@ApiTags('integrations-management')
@Roles(RolesEnum.admin)
export class AdminController {
  constructor(private readonly integrationService: IntegrationService) { }

  @Patch(':id')
  public async edit(
    @ParamModel(':id', 'Integration', true) integration: IntegrationModel,
    @Body() dto: EditIntegrationDto,
  ): Promise<IntegrationModel> {
    return this.integrationService.edit(integration._id, dto);
  }
}
