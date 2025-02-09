import { Body, Controller, ForbiddenException, Patch, Post, Req, UseGuards } from '@nestjs/common';
import {
  AbstractController,
  AccessTokenResultModel,
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
import { FastifyRequest } from 'fastify';
import { CreateTokenDto, UpdateAccessConfigDto, AccessConfigResponseDto } from '../dto';
import { BusinessModel } from '../models';
import { SiteAccessConfigsRepository } from '../repositories';
import { SiteTokensService } from '../services';
import { SiteDocument, SiteSchemaName } from '../schemas';
import { BusinessSchemaName } from '@pe/business-kit';
import { accessConfigToResponseDto } from '../transformers/access-config-to-response-dto.transformer';
import { SiteVoterCodesEnum } from '../enums';

const BUSINESS_PLACEHOLDER: string = ':businessId';
const SITE_PLACEHOLDER: string = ':siteId';

@Controller('business/:businessId/site/access')
@UseGuards(JwtAuthGuard)
@Roles(RolesEnum.merchant)
@ApiTags('site/access')
@ApiBearerAuth()
export class SiteAccessController extends AbstractController {
  constructor(
    private readonly siteAccessConfigsRepository: SiteAccessConfigsRepository,
    private readonly siteTokensService: SiteTokensService,
  ) {
    super();
  }

  @Patch(':siteId')
  @Acl({ microservice: 'site', action: AclActionsEnum.update })
  public async updateAccessConfig(
    @User() user: UserTokenInterface,
    @ParamModel(SITE_PLACEHOLDER, SiteSchemaName, true) site: SiteDocument,
    @Body() dto: UpdateAccessConfigDto,
  ): Promise<AccessConfigResponseDto> {
    await site
    .populate('business')
    .populate('accessConfigDocument')
    .execPopulate();

    await this.denyAccessUnlessGranted(SiteVoterCodesEnum.EDIT, site, user);

    return accessConfigToResponseDto(await this.siteAccessConfigsRepository.updateOne(site, dto));
  }

  @Post(':siteId/create-token')
  @Roles(RolesEnum.anonymous)
  public async createToken(
    @ParamModel(BUSINESS_PLACEHOLDER, BusinessSchemaName, true) business: BusinessModel,
    @ParamModel(SITE_PLACEHOLDER, SiteSchemaName, true) site: SiteDocument,
    @Body() createTokenDto: CreateTokenDto,
    @Req() request: FastifyRequest,
  ): Promise<AccessTokenResultModel> {

    await site
    .populate('accessConfigDocument')
    .execPopulate();

    if (
      site?.accessConfigDocument?.length === 0
    ) {
      return null;
    }

    const accessConfigDocument = site.accessConfigDocument?.length > 0 ? site.accessConfigDocument[0] : null;

    if(!accessConfigDocument?.privatePassword) {
      return null;
    }

    if (site.businessId !== business.id) {
      throw new ForbiddenException();
    }

    if (createTokenDto.password === accessConfigDocument.privatePassword) {
      return this.siteTokensService.issueTokenForSite(site, request.headers['user-agent']);
    }

    throw new ForbiddenException();


    
  }
}
