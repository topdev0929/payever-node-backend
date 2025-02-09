import { Body, Controller, Delete, Get, Param, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { AbstractController, Acl, AclActionsEnum, ParamModel } from '@pe/nest-kit';
import { JwtAuthGuard, Roles, RolesEnum } from '@pe/nest-kit/modules/auth';
import { AttributeDto, PaginationDto } from '../dto';
import { AttributeModel } from '../models';
import { AttributeSchemaName } from '../schemas';
import { AttributeService } from '../services';

@Controller('attribute')
@UseGuards(JwtAuthGuard)
@Roles(RolesEnum.admin)
@ApiTags('Attribute API')
export class AttributeController extends AbstractController{
  constructor(
    private readonly attributeService: AttributeService,
  ) {
    super();
  }

  @Post()
  public async createAttribute(
    @Body() body: AttributeDto,
  ): Promise<AttributeModel> {

    return this.attributeService.create(body);
  }

  @Patch('/:attributeId')
  public async updateAttribute(
    @Param('attributeId') attributeId: string,
    @ParamModel('attributeId', AttributeSchemaName) attribute: AttributeModel,
    @Body() body: AttributeDto,
  ): Promise<AttributeModel> {

    return this.attributeService.update(attributeId, body);
  }

  @Get()
  @Roles(RolesEnum.merchant)
  @Acl({ microservice: 'studio', action: AclActionsEnum.read })
  public async getAttribute(
    @Query() pagination: PaginationDto,
  ): Promise<AttributeModel[]> {
    return this.attributeService.findAll(pagination);
  }

  @Get('/type')
  @Roles(RolesEnum.merchant)
  @Acl({ microservice: 'studio', action: AclActionsEnum.read })
  public async getAttributeType(): Promise<string[]> {

    return this.attributeService.findType();
  }

  @Get('/type/:type')
  @Roles(RolesEnum.merchant)
  @Acl({ microservice: 'studio', action: AclActionsEnum.read })
  public async getAttributeByType(
    @Query() pagination: PaginationDto,
    @Param('type') type: string,
  ): Promise<AttributeModel[]> {
    return this.attributeService.findAllByType(type, pagination);
  }

  @Get('/:attributeId')
  @Roles(RolesEnum.merchant)
  @Acl({ microservice: 'studio', action: AclActionsEnum.read })
  public async findById(
    @ParamModel('attributeId', AttributeSchemaName) attribute: AttributeModel,
  ): Promise<AttributeModel> {

    return attribute;
  }

  @Delete('/:attributeId')
  public async deleteById(
    @ParamModel('attributeId', AttributeSchemaName) attribute: AttributeModel,
  ): Promise<void> {

    await this.attributeService.remove(attribute);
  }
}
