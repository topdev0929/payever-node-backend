import { Body, Controller, Delete, Get, Patch, Post, Put, UseGuards, Query, BadRequestException } from '@nestjs/common';
import {
  AbstractController,
  Acl,
  AclActionsEnum,
  JwtAuthGuard,
  ParamModel,
  Roles,
  RolesEnum,
  User,
  UserTokenInterface,
} from '@pe/nest-kit';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { CreateSiteDto, UpdateSiteDto, SiteResponseDto } from '../dto';
import { BusinessModel } from '../models';
import { SiteDocument, SiteSchemaName } from '../schemas';
import { BusinessSchemaName } from '@pe/business-kit';
import { SitesRepository } from '../repositories';
import { SitesService } from '../services';
import { SiteEditVoter } from '../voters';
import { siteToResponseDto } from '../transformers';
import { SiteVoterCodesEnum } from '../enums';

const BUSINESS_PLACEHOLDER: string = ':businessId';
const SITE_PLACEHOLDER: string = ':siteId';

@Controller('business/:businessId/site')
@UseGuards(JwtAuthGuard)
@Roles(RolesEnum.merchant)
@ApiTags('site/site')
@ApiBearerAuth()
export class SiteController extends AbstractController {
  constructor(
    private readonly sitesRepository: SitesRepository,
    private readonly sitesService: SitesService,
  ) {
    super();
  }

  @Get()
  @Acl({ microservice: 'site', action: AclActionsEnum.read })
  @Roles(RolesEnum.anonymous)
  public async getBusinessSites(
    @ParamModel(BUSINESS_PLACEHOLDER, BusinessSchemaName, true) business: BusinessModel,
  ): Promise<SiteResponseDto[]> {
    return (await this.sitesRepository.findByBusiness(business)).map(siteToResponseDto);
  }

  @Get(':siteId')
  @Acl({ microservice: 'site', action: AclActionsEnum.read })
  @Roles(RolesEnum.anonymous)
  public async getSite(
    @ParamModel(SITE_PLACEHOLDER, SiteSchemaName, true) site: SiteDocument,
  ): Promise<SiteResponseDto> {
    return siteToResponseDto(await this.sitesRepository.findById(site.id));
  }

  @Get('default')
  @Acl({ microservice: 'site', action: AclActionsEnum.read })
  @Roles(RolesEnum.anonymous)
  public async getDefaultSite(
    @ParamModel(BUSINESS_PLACEHOLDER, BusinessSchemaName, true) business: BusinessModel,
  ): Promise<SiteResponseDto> {
    return siteToResponseDto(await this.sitesRepository.getDefault(business));
  }

  @Get('isValidName')
  @Acl({ microservice: 'site', action: AclActionsEnum.read })
  @Roles(RolesEnum.anonymous)
  public async isValidName(
    @ParamModel(BUSINESS_PLACEHOLDER, BusinessSchemaName, true) business: BusinessModel,
    @Query('name') name: string,
  ): Promise<any> {
    if (!name) {
      throw new BadRequestException(`Query param "name" is required`);
    }

    return this.sitesService.validateSiteNameWithReturn(name, business, null);
  }

  @Post()
  @Acl({ microservice: 'site', action: AclActionsEnum.create })
  @Roles(RolesEnum.anonymous)
  public async createSite(
    @ParamModel(BUSINESS_PLACEHOLDER, BusinessSchemaName, true) business: BusinessModel,
    @Body() createSiteDto: CreateSiteDto,
    @User() user: UserTokenInterface,
  ): Promise<SiteResponseDto> {
    const site: SiteDocument = await this.sitesService.create(business, createSiteDto);

    await this.denyAccessUnlessGranted(SiteVoterCodesEnum.EDIT, site, user);

    return siteToResponseDto(site);
  }

  @Patch(':id')
  @Acl({ microservice: 'site', action: AclActionsEnum.update })
  public async updateBusinessSite(
    @ParamModel(BUSINESS_PLACEHOLDER, BusinessSchemaName, true) business: BusinessModel,
    @ParamModel(':id', SiteSchemaName, true) site: SiteDocument,
    @Body() payload: UpdateSiteDto,
    @User() user: UserTokenInterface,
  ): Promise<SiteResponseDto> {
    await site
    .populate('business')
    .execPopulate();
    await this.denyAccessUnlessGranted(SiteVoterCodesEnum.EDIT, site, user);

    return siteToResponseDto(await this.sitesService.update(site, business, payload));
  }

  @Put(':id/default')
  @Acl({ microservice: 'site', action: AclActionsEnum.update })
  public async makeBusinessSiteDefault(
    @ParamModel(BUSINESS_PLACEHOLDER, BusinessSchemaName, true) business: BusinessModel,
    @ParamModel(':id', SiteSchemaName, true) site: SiteDocument,
    @User() user: UserTokenInterface,
  ): Promise<SiteResponseDto> {
    await site
    .populate('business')
    .execPopulate();
    await this.denyAccessUnlessGranted(SiteVoterCodesEnum.EDIT, site, user);

    return siteToResponseDto(await this.sitesService.makeDefault(site, business));
  }

  @Delete(':id')
  @Acl({ microservice: 'site', action: AclActionsEnum.delete })
  public async deleteBusinessSite(
    @ParamModel(':id', SiteSchemaName, true) site: SiteDocument,
    @User() user: UserTokenInterface,
  ): Promise<void> {
    await site
    .populate('business')
    .execPopulate();
    await this.denyAccessUnlessGranted(SiteVoterCodesEnum.EDIT, site, user);

    await this.sitesService.delete(site);
  }
}
