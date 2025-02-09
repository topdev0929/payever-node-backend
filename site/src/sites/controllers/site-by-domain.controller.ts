import {
  Controller,
  UseGuards,
  Get,
  Query,
  NotFoundException, BadRequestException,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import {
  AbstractController,
  AccessTokenPayload,
  Acl, AclActionsEnum,
  JwtAuthGuard,
  Roles,
  RolesEnum,
  User,
} from '@pe/nest-kit';

import { SitesService } from '../services';
import { SitesRepository } from '../repositories';
import { SiteDocument } from '../schemas';
import { SiteResponseDto, BriefSiteInfoResponseDto } from '../dto';
import { siteToResponseDto, siteToBriefInfoResponseDto } from '../transformers';
import { SiteVoterCodesEnum } from '../enums';
import type { Populated } from '../../common';

@Controller('site')
@ApiTags('site-by-domain')
@UseGuards(JwtAuthGuard)
export class SiteByDomainController extends AbstractController {
  constructor(
    private readonly sitesService: SitesService,
    private readonly sitesRepository: SitesRepository,
  ) {
    super();
  }

  @Get('by-domain/info')
  @Roles(RolesEnum.anonymous)
  public async getSiteBriefInfoByDomain(
    @Query('domain') domain: string,
    @User() user: AccessTokenPayload,
  ): Promise<BriefSiteInfoResponseDto> {
    const site: Populated<SiteDocument, 'accessConfigDocument' | 'domainDocument'> =
      await this.sitesService.getByInternalOrOwnDomain(domain);

    return siteToBriefInfoResponseDto(site);
  }

  @Get('by-domain')
  @Acl({ microservice: 'site', action: AclActionsEnum.read })
  @Roles(RolesEnum.anonymous)
  public async getSiteByDomain(
    @Query('domain') domain: string,
    @User() user: AccessTokenPayload,
  ): Promise<SiteResponseDto> {
    const site: Populated<SiteDocument, 'accessConfigDocument' | 'domainDocument'> =
      await this.sitesService.getByInternalOrOwnDomain(domain);

    if (!site) {
      throw new NotFoundException(`Site with domain "${domain}" not found`);
    }

    const siteWithBusiness: Populated<SiteDocument, 'accessConfigDocument' | 'domainDocument' | 'business'> =
      await site.populate('business').execPopulate() as Populated<SiteDocument, 'accessConfigDocument' | 'domainDocument' | 'business'>;

    if (
      !site.accessConfigDocument || 
      site.accessConfigDocument?.length === 0 || 
      !site.accessConfigDocument[0].isLive
      ) {
      throw new NotFoundException(`Site with domain "${domain}" not live`);
    }

    await this.denyAccessUnlessGranted(
      SiteVoterCodesEnum.ACCESS,
      siteWithBusiness,
      user,
      `You have no permission to access site with domain "${domain}"`,
    );

    return siteToResponseDto(siteWithBusiness);
  }

  @Get('theme/by-domain')
  @Acl({ microservice: 'shop', action: AclActionsEnum.read })
  @Roles(RolesEnum.anonymous)
  public async getShopRouteByDomain(
      @Query('domain') domain: string,
  ): Promise<any> {
    if (!domain) {
      throw new BadRequestException('Query param domain is required');
    }

    const site: Populated<SiteDocument, 'accessConfigDocument' | 'domainDocument'> =
        await this.sitesService.getByInternalOrOwnDomain(domain);
    if (!site) {
      throw new NotFoundException(`Site with domain "${domain}" not found`);
    }

    return this.sitesService.getSiteThemeByDomain(domain);
  }
}
