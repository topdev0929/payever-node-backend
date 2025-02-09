import { Body, Controller, Delete, HttpCode, HttpStatus, Post, Get, Patch, UseGuards, Query, NotFoundException } from '@nestjs/common';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import {
  AbstractController,
  AccessTokenPayload,
  JwtAuthGuard,
  ParamModel,
  Roles,
  RolesEnum,
  TokensResultModel,
  User,
} from '@pe/nest-kit';
import { BusinessSchemaName, BusinessModel, BusinessService } from '@pe/business-kit';
import { AffiliateBrandingsService } from '../services';
import { AffiliateBrandingModel } from '../models';
import { AffiliateBrandingDto, AppWithAccessConfigDto, IsValidNameDto } from '../dto';
import { AffiliateBrandingSchemaName } from '../schemas';
import { ValidateAffiliateNameResponseInterface } from '../interfaces';
import { AffiliatesBrandingQueryDto } from '../dto/affiliates-branding-query.dto';
import { AdminAffiliateBrandingDto } from '../dto/admin-affiliate-branding.dto';

const INVALID_CREDENTIALS_MESSAGE: string = 'Invalid credentials';
const AFFILIATES_BRANDING_ID: string = ':affiliateBrandingId';

@Controller('admin/affiliate-brandings')
@ApiTags('admin affiliate brandings')
@UseGuards(JwtAuthGuard)
@Roles(RolesEnum.admin)
@ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: INVALID_CREDENTIALS_MESSAGE })
@ApiResponse({ status: HttpStatus.OK, type: TokensResultModel, description: '' })
export class AdminAffiliateBrandingsController extends AbstractController {
  constructor(
    private readonly affiliateBrandingsService: AffiliateBrandingsService,
    private readonly businessService: BusinessService,
  ) {
    super();
  }
  @Get()
  @HttpCode(HttpStatus.OK)
  public async getAffiliateBranding(
    @Query() query: AffiliatesBrandingQueryDto,
  ): Promise<AffiliateBrandingModel[]> {
    return this.affiliateBrandingsService.getForAdmin(query);
  }

  @Get(AFFILIATES_BRANDING_ID)
  @HttpCode(HttpStatus.OK)
  public async getAffiliateBrandingById(
    @ParamModel(AFFILIATES_BRANDING_ID, AffiliateBrandingSchemaName, true)
    affiliateBranding: AffiliateBrandingModel,
  ): Promise<AppWithAccessConfigDto> {
    return this.affiliateBrandingsService.appWithAccessConfig(affiliateBranding);
  }

  @Post()
  @HttpCode(HttpStatus.OK)
  public async createAffiliateBranding(
    @Body() createAffiliateBrandingDto: AdminAffiliateBrandingDto,
  ): Promise<AffiliateBrandingModel> {
    const business: BusinessModel = await this.businessService.findOneById(createAffiliateBrandingDto.businessId);
    if (!business) { throw new NotFoundException(`business with id:'${createAffiliateBrandingDto.businessId}' does not exist`); }

    return this.affiliateBrandingsService.create(business, createAffiliateBrandingDto);
  }

  @Patch(AFFILIATES_BRANDING_ID)
  @HttpCode(HttpStatus.OK)
  public async updateAffiliateBranding(
    @Body() updateAffiliateBrandingDto: AffiliateBrandingDto,
    @ParamModel(AFFILIATES_BRANDING_ID, AffiliateBrandingSchemaName, true)
    affiliateBranding: AffiliateBrandingModel,
  ): Promise<AffiliateBrandingModel> {
    const businessId: string = affiliateBranding.business as any;
    const business: BusinessModel = await this.businessService.findOneById(businessId);
    if (!business) { throw new NotFoundException(`business with id:'${businessId}' does not exist`); }

    return this.affiliateBrandingsService.update(affiliateBranding, updateAffiliateBrandingDto, business);
  }

  @Delete(AFFILIATES_BRANDING_ID)
  @HttpCode(HttpStatus.OK)
  public async deleteAffiliateBranding(
    @User() user: AccessTokenPayload,
    @ParamModel(AFFILIATES_BRANDING_ID, AffiliateBrandingSchemaName, true)
    affiliateBranding: AffiliateBrandingModel,
  ): Promise<void> {
    return this.affiliateBrandingsService.delete(affiliateBranding);
  }

  @Get('/business/:businessId/isValidName')
  public async isValidName(
    @ParamModel('businessId', BusinessSchemaName) business: BusinessModel,
    @Query() isValidNameDto: IsValidNameDto,
  ): Promise<ValidateAffiliateNameResponseInterface> {
    return this.affiliateBrandingsService.isBrandingNameAvailable(isValidNameDto.name, business, null);
  }
}
