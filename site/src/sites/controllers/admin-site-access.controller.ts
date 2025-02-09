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

const SITE_ID: string = ':siteId';

@Controller('admin/sites/access')
@UseGuards(JwtAuthGuard)
@Roles(RolesEnum.admin)
@ApiTags('admin site/access')
@ApiBearerAuth()
export class AdminSiteAccessController extends AbstractController {
  constructor(
    private readonly siteAccessConfigsRepository: SiteAccessConfigsRepository,
    private readonly siteTokensService: SiteTokensService,
  ) {
    super();
  }

  @Patch(SITE_ID)
  public async updateAccessConfig(
    @ParamModel(SITE_ID, SiteSchemaName, true) site: SiteDocument,
    @Body() dto: UpdateAccessConfigDto,
  ): Promise<AccessConfigResponseDto> {
    await site
    .populate('business')
    .populate('accessConfigDocument')
    .execPopulate();

    return accessConfigToResponseDto(await this.siteAccessConfigsRepository.updateOne(site, dto));
  }
}
