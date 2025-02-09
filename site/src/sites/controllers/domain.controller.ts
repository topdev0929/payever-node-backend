import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  ForbiddenException,
  Get,
  HttpCode,
  HttpStatus,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ApiParam, ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { AbstractController, Acl, AclActionsEnum, JwtAuthGuard, ParamModel, Roles, RolesEnum } from '@pe/nest-kit';

import { DomainModel, BusinessModel } from '../models';
import { DomainRepository } from '../repositories/domain.repository';
import { DomainService } from '../services/domain.service';
import { SiteSchemaName, SiteDocument } from '../schemas';
import { CheckDomainStatusResultInterface } from '../interfaces';
import { DomainSchemaName } from '../schemas/domain.schema';
import { CreateDomainDto, PatchDomainDto } from '../dto';
import { BusinessSchemaName } from '@pe/business-kit';

const BUSINESS_PLACEHOLDER: string = ':businessId';
const SITE_PLACEHOLDER: string = ':siteId';
const DOMAIN_PLACEHOLDER: string = ':domainId';

@Controller('business/:businessId/site/:siteId/domain')
@UseGuards(JwtAuthGuard)
@Roles(RolesEnum.merchant)
@ApiTags('site/domain')
@ApiBearerAuth()
export class DomainController extends AbstractController {
  constructor(
    private readonly domainService: DomainService,
    private readonly domainRepository: DomainRepository,
  ) {
    super();
  }

  @Post('')
  @Acl({ microservice: 'site', action: AclActionsEnum.read })
  @ApiParam({ name: 'businessId' })
  @ApiParam({ name: 'siteId' })
  public async create(
    @ParamModel(BUSINESS_PLACEHOLDER, BusinessSchemaName, true) business: BusinessModel,
    @ParamModel(SITE_PLACEHOLDER, SiteSchemaName, true) site: SiteDocument,
    @Body() dto: CreateDomainDto,
  ): Promise<DomainModel> {
    if (site.businessId !== business._id) {
      throw new ForbiddenException({
        message: `Site "${site._id}" not relates to business "${business._id}"`,
      });
    }

    return this.domainService.createDomain(site._id, dto);
  }

  @Get('/:domainId')
  @Acl({ microservice: 'site', action: AclActionsEnum.read })
  @ApiParam({ name: 'businessId' })
  @ApiParam({ name: 'siteId' })
  @ApiParam({ name: 'domainId' })
  public async read(
    @ParamModel(BUSINESS_PLACEHOLDER, BusinessSchemaName, true) business: BusinessModel,
    @ParamModel(SITE_PLACEHOLDER, SiteSchemaName, true) site: SiteDocument,
    @ParamModel(DOMAIN_PLACEHOLDER, DomainSchemaName, true) domain: DomainModel,
  ): Promise<DomainModel> {
    return domain;
  }

  @Get('')
  @Acl({ microservice: 'site', action: AclActionsEnum.read })
  @ApiParam({ name: 'businessId' })
  @ApiParam({ name: 'siteId' })
  public async readBySite(
    @ParamModel(BUSINESS_PLACEHOLDER, BusinessSchemaName, true) business: BusinessModel,
    @ParamModel(SITE_PLACEHOLDER, SiteSchemaName, true) site: SiteDocument,
  ): Promise<DomainModel[]> {
    return this.domainRepository.read({
      site: site._id,
    });
  }

  @Patch('/:domainId')
  @Acl({ microservice: 'site', action: AclActionsEnum.update })
  @ApiParam({ name: 'businessId' })
  @ApiParam({ name: 'siteId' })
  @ApiParam({ name: 'domainId' })
  public async updateDomain(
    @ParamModel(BUSINESS_PLACEHOLDER, BusinessSchemaName, true) business: BusinessModel,
    @ParamModel(SITE_PLACEHOLDER, SiteSchemaName, true) site: SiteDocument,
    @ParamModel(DOMAIN_PLACEHOLDER, DomainSchemaName, true) domain: DomainModel,
    @Body() dto: PatchDomainDto,
  ): Promise<DomainModel> {
    return this.domainRepository.update({
      ...dto,
      _id: domain._id,
    });
  }

  @Delete('/:domainId')
  @HttpCode(HttpStatus.NO_CONTENT)
  @Acl({ microservice: 'site', action: AclActionsEnum.update })
  @ApiParam({ name: 'businessId' })
  @ApiParam({ name: 'siteId' })
  @ApiParam({ name: 'domainId' })
  public async deleteDomain(
    @ParamModel(BUSINESS_PLACEHOLDER, BusinessSchemaName, true) business: BusinessModel,
    @ParamModel(SITE_PLACEHOLDER, SiteSchemaName, true) site: SiteDocument,
    @ParamModel(DOMAIN_PLACEHOLDER, DomainSchemaName, true) domain: DomainModel,
  ): Promise<void> {
    await this.domainService.deleteDomain(domain._id);
  }


  @Post('/:domainId/check')
  @Acl({ microservice: 'site', action: AclActionsEnum.read })
  @ApiParam({ name: 'businessId' })
  @ApiParam({ name: 'siteId' })
  @ApiParam({ name: 'domainId' })
  public async checkStatus(
    @ParamModel(BUSINESS_PLACEHOLDER, BusinessSchemaName, true) business: BusinessModel,
    @ParamModel(SITE_PLACEHOLDER, SiteSchemaName, true) site: SiteDocument,
    @ParamModel(DOMAIN_PLACEHOLDER, DomainSchemaName, true) domain: DomainModel,
  ): Promise<CheckDomainStatusResultInterface> {
    if (domain.site !== site._id) {
      throw new BadRequestException({
        message: `Domain not found`, // or other text
      });
    }

    return this.domainService.checkStatus(domain);
  }
}
