import {
  Controller,
  Get,
  Delete,
  Post,
  Patch,
  Query,
  Body,
  HttpStatus,
  UseGuards,
  HttpCode,
} from '@nestjs/common';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ParamModel, JwtAuthGuard, RolesEnum, Roles } from '@pe/nest-kit';
import { IntegrationService } from '../services';
import { AdminIntegrationDto, IntegrationSubscriptionQueryDto } from '../dto';
import { IntegrationSchemaName } from '../schemas';
import { IntegrationModel } from '..';

const INTEGRATION_ID: string = ':integrationId';

@Controller('admin/integrations')
@ApiTags('admin integrations')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
@Roles(RolesEnum.admin)
@ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Invalid authorization token.' })
@ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Unauthorized.' })
export class AdminIntegrationsController {
  constructor(
    private readonly integrationService: IntegrationService,
  ) { }

  @Get()
  @HttpCode(HttpStatus.OK)
  public async getIntegrations(
    @Query() query: IntegrationSubscriptionQueryDto,
  ): Promise<any> {
    return this.integrationService.getForAdmin(query);
  }

  @Get(INTEGRATION_ID)
  @HttpCode(HttpStatus.OK)
  public async getIntegrationById(
    @ParamModel(INTEGRATION_ID, IntegrationSchemaName, true)
    integration: IntegrationModel,
  ): Promise<IntegrationModel> {
    return integration;
  }


  @Patch(`${INTEGRATION_ID}/allowed-businesses`)
  @HttpCode(HttpStatus.OK)
  public async addAllowedBusiness(
    @Body() allowedBusinessIds: string[],
    @ParamModel(INTEGRATION_ID, IntegrationSchemaName, true)
    integration: IntegrationModel,
  ): Promise<string[]> {
    return (await this.integrationService.addAllowedBusiness(integration._id, allowedBusinessIds)).allowedBusinesses;
  }

  @Delete(`${INTEGRATION_ID}/allowed-businesses`)
  @HttpCode(HttpStatus.OK)
  public async removeAllowedBusiness(
    @Body() allowedBusinessIds: string[],
    @ParamModel(INTEGRATION_ID, IntegrationSchemaName, true)
    integration: IntegrationModel,
  ): Promise<string[]> {
    return (await this.integrationService.removeAllowedBusiness(integration._id, allowedBusinessIds)).allowedBusinesses;
  }

  @Post()
  @HttpCode(HttpStatus.OK)
  public async createIntegration(
    @Body() integrationDto: AdminIntegrationDto,
  ): Promise<IntegrationModel> {
    return this.integrationService.create(integrationDto);
  }

  @Patch(INTEGRATION_ID)
  @HttpCode(HttpStatus.OK)
  public async updateIntegration(
    @Body() integrationDto: AdminIntegrationDto,
    @ParamModel(INTEGRATION_ID, IntegrationSchemaName, true)
    integration: IntegrationModel,
  ): Promise<IntegrationModel> {
    return this.integrationService.updateForAdmin(integration._id, integrationDto);
  }

  @Delete(INTEGRATION_ID)
  @HttpCode(HttpStatus.OK)
  public async deleteIntegration(
    @ParamModel(INTEGRATION_ID, IntegrationSchemaName, true)
    integration: IntegrationModel,
  ): Promise<void> {
    await this.integrationService.deleteForAdmin(integration._id);
  }
}
