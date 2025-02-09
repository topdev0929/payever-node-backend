import {  
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Patch,
  Post,
  UseGuards,
  Query,
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { AbstractController, JwtAuthGuard, ParamModel, Roles, RolesEnum } from '@pe/nest-kit';
import { DomainModel } from '../models';
import { DomainRepository } from '../repositories/domain.repository';
import { DomainService } from '../services/domain.service';
import { CheckDomainStatusResultInterface } from '../interfaces';
import { DomainSchemaName } from '../schemas/domain.schema';
import { AdminCreateDomainDto, DomainQueryDto, PatchDomainDto } from '../dto';

const DOMAIN_ID: string = ':domainId';

@Controller('admin/domains')
@UseGuards(JwtAuthGuard)
@Roles(RolesEnum.admin)
@ApiTags('admin site/domain')
@ApiBearerAuth()
export class AdminDomainsController extends AbstractController {
  constructor(
    private readonly domainService: DomainService,
    private readonly domainRepository: DomainRepository,
  ) {
    super();
  }
  
  @Get()
  @HttpCode(HttpStatus.OK)
  public async getAll(
    @Query() query: DomainQueryDto,
  ): Promise<any> {
    return this.domainService.getForAdmin(query);
  }

  @Get(DOMAIN_ID)
  @HttpCode(HttpStatus.OK)
  public async getById(
    @ParamModel(DOMAIN_ID, DomainSchemaName, true) domain: DomainModel,
  ): Promise<DomainModel> {
    return domain;
  }

  @Get(`${DOMAIN_ID}/check`)
  @HttpCode(HttpStatus.OK)
  public async checkStatus(
    @ParamModel(DOMAIN_ID, DomainSchemaName, true) domain: DomainModel,
  ): Promise<CheckDomainStatusResultInterface> {
    return this.domainService.checkStatus(domain);
  }
  
  @Post()
  @HttpCode(HttpStatus.OK)
  public async create(    
    @Body() dto: AdminCreateDomainDto,
  ): Promise<DomainModel> {
    return this.domainService.createDomain(dto.siteId, dto);
  }

  @Patch(DOMAIN_ID)
  @HttpCode(HttpStatus.OK)
  public async updateDomain(
    @ParamModel(DOMAIN_ID, DomainSchemaName, true) domain: DomainModel,
    @Body() dto: PatchDomainDto,
  ): Promise<DomainModel> {
    return this.domainRepository.update({ ...dto, _id: domain._id });
  }

  @Delete(`${DOMAIN_ID}`)
  @HttpCode(HttpStatus.OK)
  public async delete(
    @ParamModel(DOMAIN_ID, DomainSchemaName, true) domain: DomainModel,
  ): Promise<void> {
    await this.domainService.deleteDomain(domain.id);
  }
}
