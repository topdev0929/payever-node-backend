import {
  Body,
  Controller,
  Get,
  HttpException,
  Param,
  Post,
  UseGuards,
  Patch,
  NotFoundException,
  Query,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import {
  Acl,
  AclActionsEnum,
  JwtAuthGuard,
  ParamModel,
  Roles,
  RolesEnum,
  User,
  UserTokenInterface,
} from '@pe/nest-kit';

import {
  CreateIntegrationDto,
  CreateIntegrationReviewDto,
  AddIntegrationRatingDto,
  AddIntegrationVersionDto,
  IntegrationListDto,
} from '../dto';
import { IntegrationModel } from '../models';
import { IntegrationService } from '../services';
import { IntegrationVersionInterface } from '../interfaces/integration-version.interface';
import { IntegrationReviewInterface } from '../interfaces';
import { IntegrationSchemaName } from '../schemas';

@ApiBearerAuth()
@Controller('integration')
@UseGuards(JwtAuthGuard)
@ApiTags('integration')
@Roles(RolesEnum.merchant)
@Acl({ microservice: 'connect', action: AclActionsEnum.read })
export class IntegrationController {
  constructor(private readonly integrationService: IntegrationService) { }

  @Get()
  public async findAll(
    @Query() query: IntegrationListDto,
  ): Promise<IntegrationModel[]> {
    return this.integrationService.findAll(query);
  }

  @Get(':integrationName')
  @Roles(RolesEnum.guest, RolesEnum.merchant)
  public async findByName(
    @Param('integrationName') integrationName: string,
  ): Promise<IntegrationModel> {
    return this.integrationService.findOneByName(integrationName, true);
  }

  @Get(':integrationName/scopes')
  @Roles(RolesEnum.guest, RolesEnum.merchant)
  public async integrationScopes(
    @ParamModel(
      {
        name: ':integrationName',
      },
      IntegrationSchemaName,
      true,
    ) integration: IntegrationModel,
  ): Promise<string[]> {
    return integration.scopes;
  }

  @Get('category/:category')
  public async findByCategory(
    @Param('category') category: string,
  ): Promise<IntegrationModel[]> {
    return this.integrationService.findByCategory(category);
  }

  @Post()
  @Roles(RolesEnum.admin)
  public async create(
    @Body() data: CreateIntegrationDto,
  ): Promise<IntegrationModel> {
    if (await this.integrationService.findOneByNameAndCategory(data.name, data.category)) {
      throw new HttpException(`Integration already exists for category`, 400);
    }

    return this.integrationService.create(data);
  }

  @Patch(':integrationName/rate')
  @Roles(RolesEnum.merchant)
  public async addRating(
    @Param('integrationName') integrationName: string,
    @Body() body: AddIntegrationRatingDto,
    @User() user: UserTokenInterface,
  ): Promise<void> {
    const integration: IntegrationModel = await this.integrationService.findOneByName(integrationName);

    if (!integration) {
      throw new NotFoundException(
        `Third party integration of name '${integrationName}' not found'`,
      );
    }

    const ratingObj: IntegrationReviewInterface = {
      ...body,
      reviewDate: new Date().toISOString(),
      userFullName: `${user.firstName} ${user.lastName}`,
      userId: user.id,
    };
    await this.integrationService.addRating(integration, ratingObj);
  }

  @Patch(':integrationName/add-review')
  @Roles(RolesEnum.merchant)
  public async addReview(
    @Param('integrationName') integrationName: string,
    @Body() body: CreateIntegrationReviewDto,
    @User() user: UserTokenInterface,
  ): Promise<void> {
    const integration: IntegrationModel = await this.integrationService.findOneByName(integrationName);

    if (!integration) {
      throw new NotFoundException(
        `Third party integration of name '${integrationName}' not found'`,
      );
    }

    const reviewObj: IntegrationReviewInterface = {
      ...body,
      reviewDate: new Date().toISOString(),
      userFullName: `${user.firstName} ${user.lastName}`,
      userId: user.id,
    };
    await this.integrationService.addReview(integration, reviewObj);
  }

  @Patch(':integrationName/add-version')
  @Roles(RolesEnum.admin)
  public async addVersion(
    @Param('integrationName') integrationName: string,
    @Body() body: AddIntegrationVersionDto,
  ): Promise<void> {
    const integration: IntegrationModel = await this.integrationService.findOneByName(integrationName);

    if (!integration) {
      throw new NotFoundException(
        `Third party integration of name '${integrationName}' not found'`,
      );
    }

    await this.integrationService.addVersion(integration, body);
  }

  @Get(':integrationName/versions')
  @Roles(RolesEnum.admin)
  public async getVersions(
    @Param('integrationName') integrationName: string,
  ): Promise<IntegrationVersionInterface[]> {
    const integration: IntegrationModel = await this.integrationService.findOneByName(integrationName);

    if (!integration) {
      throw new NotFoundException(
        `Third party integration of name '${integrationName}' not found'`,
      );
    }

    return integration.versions || [];
  }
}
