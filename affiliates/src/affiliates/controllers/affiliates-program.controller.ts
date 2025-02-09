import { Body, Query, Controller, Delete, HttpCode, HttpStatus, Post, Get, Patch, UseGuards } from '@nestjs/common';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import {
  AbstractController,
  AccessTokenPayload,
  Acl,
  AclActionsEnum,
  JwtAuthGuard,
  ParamModel,
  Roles,
  RolesEnum,
  TokensResultModel,
  User,
} from '@pe/nest-kit';
import { BusinessSchemaName, BusinessModel } from '@pe/business-kit';
import { AffiliateProgramsService } from '../services';
import { AffiliateBrandingModel, AffiliateProgramModel } from '../models';
import { AffiliateProgramDto, CookieDataDto, GetCookieDataDto, TargetUrlDto } from '../dto';
import { AffiliateBrandingSchemaName, AffiliateProgramSchemaName } from '../schemas';
import { environment } from '../../environments';
import { AffiliateProgramInterface, CookieDataInterface, TragetUrlResultInterface } from '../interfaces';

const INVALID_CREDENTIALS_MESSAGE: string = 'Invalid credentials';

@Controller('business/:businessId/affiliates-program')
@ApiTags('affiliate programs')
@UseGuards(JwtAuthGuard)
export class AffiliateProgramsController extends AbstractController {
  constructor(
    private readonly affiliateProgramsService: AffiliateProgramsService,
  ) {
    super();
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: INVALID_CREDENTIALS_MESSAGE })
  @ApiResponse({ status: HttpStatus.OK, type: TokensResultModel, description: '' })
  @Acl({ microservice: environment.microservice, action: AclActionsEnum.read })
  @Roles(RolesEnum.merchant)
  public async getAffiliateProgram(
    @ParamModel(':businessId', BusinessSchemaName, true) business: BusinessModel,
  ): Promise<AffiliateProgramModel[]> {
    return this.affiliateProgramsService.getByBusiness(business);
  }

  @Get(':affiliateProgramId')
  @HttpCode(HttpStatus.OK)
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: INVALID_CREDENTIALS_MESSAGE })
  @ApiResponse({ status: HttpStatus.OK, type: TokensResultModel, description: '' })
  @Acl({ microservice: environment.microservice, action: AclActionsEnum.read })
  @Roles(RolesEnum.merchant, RolesEnum.anonymous)
  public async getAffiliateProgramById(
    @ParamModel(':affiliateProgramId', AffiliateProgramSchemaName, true) affiliateProgram: AffiliateProgramModel,
  ): Promise<AffiliateProgramModel> {
    return affiliateProgram;
  }

  @Get('/branding/:affiliateBrandingId')
  @HttpCode(HttpStatus.OK)
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: INVALID_CREDENTIALS_MESSAGE })
  @ApiResponse({ status: HttpStatus.OK, type: TokensResultModel, description: '' })
  @Acl({ microservice: environment.microservice, action: AclActionsEnum.read })
  @Roles(RolesEnum.merchant)
  public async getAffiliateProgramByBranding(
    @ParamModel(':affiliateBrandingId', AffiliateBrandingSchemaName, true) affiliateBranding: AffiliateBrandingModel,
  ): Promise<AffiliateProgramModel[]> {
    return this.affiliateProgramsService.getByBranding(affiliateBranding._id);
  }

  @Post()
  @HttpCode(HttpStatus.OK)
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: INVALID_CREDENTIALS_MESSAGE })
  @ApiResponse({ status: HttpStatus.OK, type: TokensResultModel, description: '' })
  @Acl({ microservice: environment.microservice, action: AclActionsEnum.create })
  @Roles(RolesEnum.merchant)
  public async createAffiliateProgram(
    @Body() createAffiliateProgramDto: AffiliateProgramDto,
    @ParamModel(':businessId', BusinessSchemaName, true) business: BusinessModel,
  ): Promise<AffiliateProgramInterface & { applicationScopeElasticId: string; businessScopeElasticId: string }> {
    return this.affiliateProgramsService.create(business, createAffiliateProgramDto);
  }

  @Get('/generate-cookie')
  @HttpCode(HttpStatus.OK)
  @Acl({ microservice: environment.microservice, action: AclActionsEnum.create })
  @Roles(RolesEnum.anonymous)
  public async generateCookieData(
    @Query() dto: CookieDataDto,
  ): Promise<CookieDataInterface> {
    return this.affiliateProgramsService.generateCookieData(dto);
  }

  @Get('/cookie-data')
  @HttpCode(HttpStatus.OK)
  @Acl({ microservice: environment.microservice, action: AclActionsEnum.create })
  @Roles(RolesEnum.anonymous)
  public async getCookieData(
    @Query() dto: GetCookieDataDto,
  ): Promise<CookieDataInterface> {
    return this.affiliateProgramsService.getCookieData(dto.hash);
  }

  @Get('/target-url')
  @HttpCode(HttpStatus.OK)
  @Acl({ microservice: environment.microservice, action: AclActionsEnum.create })
  @Roles(RolesEnum.anonymous)
  public async getTargetUrl(
    @Query() dto: TargetUrlDto,
  ): Promise<TragetUrlResultInterface> {
    return this.affiliateProgramsService.getTargetUrl(dto);
  }

  @Patch('/:affiliateProgramId')
  @HttpCode(HttpStatus.OK)
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: INVALID_CREDENTIALS_MESSAGE })
  @ApiResponse({ status: HttpStatus.OK, type: TokensResultModel, description: '' })
  @Acl({ microservice: environment.microservice, action: AclActionsEnum.update })
  @Roles(RolesEnum.merchant)
  public async updateAffiliateProgram(
    @Body() updateAffiliateProgramDto: AffiliateProgramDto,
    @ParamModel(':businessId', BusinessSchemaName, true) business: BusinessModel,
    @ParamModel(':affiliateProgramId', AffiliateProgramSchemaName, true) affiliateProgram: AffiliateProgramModel,
  ): Promise<AffiliateProgramModel> {
    return this.affiliateProgramsService.update(business, affiliateProgram, updateAffiliateProgramDto);
  }

  @Delete('/:affiliateProgramId')
  @HttpCode(HttpStatus.OK)
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: INVALID_CREDENTIALS_MESSAGE })
  @ApiResponse({ status: HttpStatus.OK, type: TokensResultModel, description: '' })
  @Acl({ microservice: environment.microservice, action: AclActionsEnum.delete })
  @Roles(RolesEnum.merchant)
  public async deleteAffiliateProgram(
    @User() user: AccessTokenPayload,
    @ParamModel(':affiliateProgramId', AffiliateProgramSchemaName, true) affiliateProgram: AffiliateProgramModel,
  ): Promise<void> {

    return this.affiliateProgramsService.delete(affiliateProgram);
  }
}
