import { Body, ConflictException, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Acl, AclActionsEnum, JwtAuthGuard, ParamModel, Roles, RolesEnum } from '@pe/nest-kit';
import { IntegrationSchemaName } from '../schemas';
import { CreateIntegrationDto } from '../dtos';
import { IntegrationModel } from '../models';
import { IntegrationService } from '../services';

@ApiTags('integration')
@Controller('integration')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class IntegrationController {
  constructor(
    private readonly integrationService: IntegrationService,
  ) { }

  @Get()
  @Roles(RolesEnum.merchant)
  @Acl(
    { microservice: 'subscriptions', action: AclActionsEnum.read },
    { microservice: 'connect', action: AclActionsEnum.read },
  )
  public async findAll(): Promise<IntegrationModel[]> {
    return this.integrationService.findAll();
  }

  @Get(':integrationName')
  @Roles(RolesEnum.merchant)
  @Acl(
    { microservice: 'subscriptions', action: AclActionsEnum.read },
    { microservice: 'connect', action: AclActionsEnum.read },
  )
  public async findByName(
    @ParamModel({ name: ':integrationName'}, IntegrationSchemaName) integration: IntegrationModel,
  ): Promise<IntegrationModel> {
    return integration;
  }

  @Get('category/:category')
  @Roles(RolesEnum.merchant)
  @Acl(
    { microservice: 'subscriptions', action: AclActionsEnum.read },
    { microservice: 'connect', action: AclActionsEnum.read },
  )
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
      throw new ConflictException(`Integration already exists for category`);
    }

    return this.integrationService.create(data);
  }
}
