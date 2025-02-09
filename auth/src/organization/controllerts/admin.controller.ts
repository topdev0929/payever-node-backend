import {
  Body,
  Controller,
  Post,
  UseGuards,
  HttpStatus,
  HttpCode,
  Get,
  Patch,
  Delete,
  Inject,
  forwardRef,
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';

import {
  JwtAuthGuard,
  ParamModel,
  Roles,
  RolesEnum,
} from '@pe/nest-kit';
import { CreateOrganizationDto, CreateOrganizationResponseDto, UpdateOrganizationDto } from '../dto';
import { OrganizationModel } from '../models';
import { OrganizationSchemaName } from '../schemas';
import { OrganizationService } from '../services';
import { OAuthClient, OAuthService } from '../../oauth';

const ORGANIZATION_ID_PLACEHOLDER: string = ':organizationId';

@Controller('api/admin/organizations')
@ApiTags('organization')
@UseGuards(JwtAuthGuard)
@Roles(RolesEnum.admin)
@ApiBearerAuth()
export class AdminController {
  constructor(
    private readonly organizationService: OrganizationService,
    @Inject(forwardRef(() => OAuthService))
    private readonly oauthService: OAuthService,
  ) { }

  @Get()
  public async getOrganizations(): Promise<OrganizationModel[]> {
    return this.organizationService.findAll();
  }

  @Post()
  @HttpCode(HttpStatus.OK)
  public async createOrganization(
    @Body() dto: CreateOrganizationDto,
  ): Promise<CreateOrganizationResponseDto> {
    const organization: OrganizationModel = await this.organizationService.create(dto);
    const client: OAuthClient = await this.oauthService.createClientFromOrganization(organization);

    return {
      businesses: organization.businesses,
      clientId: client._id,
      id: organization._id,
      name: organization.name,
      secret: client.secret,
    };
  }

  @Get(ORGANIZATION_ID_PLACEHOLDER)
  public async getOrganization(
    @ParamModel(ORGANIZATION_ID_PLACEHOLDER, OrganizationSchemaName, true) organization: OrganizationModel,
  ): Promise<OrganizationModel> {
    return organization;
  }

  @Patch(ORGANIZATION_ID_PLACEHOLDER)
  public async updateOrganization(
    @ParamModel(ORGANIZATION_ID_PLACEHOLDER, OrganizationSchemaName, true) organization: OrganizationModel,
    @Body() dto: UpdateOrganizationDto,
  ): Promise<OrganizationModel> {
    return this.organizationService.update(organization, dto);
  }

  @Delete(ORGANIZATION_ID_PLACEHOLDER)
  public async deleteOrganization(
    @ParamModel(ORGANIZATION_ID_PLACEHOLDER, OrganizationSchemaName, true) organization: OrganizationModel,
  ): Promise<void> {
    return this.organizationService.remove(organization);
  }

  @Post(`${ORGANIZATION_ID_PLACEHOLDER}/new-secret`)
  @HttpCode(HttpStatus.OK)
  public async generateNewClientSecret(
    @ParamModel(ORGANIZATION_ID_PLACEHOLDER, OrganizationSchemaName, true) organization: OrganizationModel,
  ): Promise<CreateOrganizationResponseDto> {
    const client: OAuthClient = await this.oauthService.generateNewClientSecretForOrganization(organization);

    return {
      businesses: organization.businesses,
      clientId: client._id,
      id: organization._id,
      name: organization.name,
      secret: client.secret,
    };
  }
}
