import {  Controller, Delete, Get, Body, Patch, Put, Post,
  UseGuards, Query, HttpCode, HttpStatus,
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard, ParamModel, Roles, RolesEnum } from '@pe/nest-kit';
import { AdminCreateSiteDto, AdminSiteListDto, SiteResponseDto, UpdateSiteDto } from '../dto';
import { SiteDocument, SiteSchemaName } from '../schemas';
import { SitesRepository } from '../repositories';
import { SitesService } from '../services';
import { siteToResponseDto } from '../transformers';

const SITE_ID: string = ':siteId';

@Controller('admin/sites')
@UseGuards(JwtAuthGuard)
@Roles(RolesEnum.admin)
@ApiTags('admin sites')
@ApiBearerAuth()
export class AdminSitesController {
  constructor(
    private readonly sitesRepository: SitesRepository,
    private readonly sitesService: SitesService,
  ) { }
  @Get()
  public async getAll(
    @Query() query: AdminSiteListDto,
  ): Promise<any> {
    return this.sitesRepository.getForAdmin(query);
  }

  @Get(SITE_ID)
  public async getById(
    @ParamModel(SITE_ID, SiteSchemaName, true) site: SiteDocument,
  ): Promise<SiteResponseDto> {
    return siteToResponseDto(await this.sitesRepository.findById(site.id));
  }

  @Post()
  @HttpCode(HttpStatus.OK)
  public async create(
    @Body() createSiteDto: AdminCreateSiteDto,
  ): Promise<SiteResponseDto> {
      const site: SiteDocument = await this.sitesService.createForAdmin(createSiteDto);

      return siteToResponseDto(site);
  }

  @Patch(SITE_ID)
  public async update(
    @ParamModel(SITE_ID, SiteSchemaName, true) site: SiteDocument,
    @Body() payload: UpdateSiteDto,
  ): Promise<SiteResponseDto> {
    await site.populate('business').execPopulate();

    return siteToResponseDto(await this.sitesService.update(site, site.business, payload));
  }

  @Put(`${SITE_ID}/default`)
  public async setDefault(
    @ParamModel(SITE_ID, SiteSchemaName, true) site: SiteDocument,
  ): Promise<SiteResponseDto> {
    await site.populate('business').execPopulate();

    return siteToResponseDto(await this.sitesService.makeDefault(site, site.business));
  }

  @Delete(SITE_ID)
  public async delete(
    @ParamModel(SITE_ID, SiteSchemaName, true) site: SiteDocument,
  ): Promise<void> {
    await site.populate('business').execPopulate();
    await this.sitesService.delete(site);
  }
}
