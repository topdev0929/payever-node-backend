import { Body, Query, Controller, Delete, HttpCode, HttpStatus, Post, Get, Patch, UseGuards, NotFoundException } from '@nestjs/common';
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
import { BusinessModel, BusinessService } from '@pe/business-kit';
import { AffiliateProgramsService } from '../services';
import { AffiliateProgramModel } from '../models';
import { AdminAffiliateProgramDto, AffiliateProgramDto, AffiliatesProgramQueryDto } from '../dto';
import { AffiliateProgramSchemaName } from '../schemas';
import { environment } from '../../environments';
import { AffiliateProgramInterface } from '../interfaces';

const INVALID_CREDENTIALS_MESSAGE: string = 'Invalid credentials';
const AFFILIATES_BRANDING_ID: string = ':affiliateProgramId';

@Controller('admin/affiliate-programs')
@ApiTags('admin affiliate programs')
@UseGuards(JwtAuthGuard)
@Roles(RolesEnum.admin)
@ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: INVALID_CREDENTIALS_MESSAGE })
@ApiResponse({ status: HttpStatus.OK, type: TokensResultModel, description: '' })
export class AdminAffiliateProgramsController extends AbstractController {
  constructor(
    private readonly affiliateProgramsService: AffiliateProgramsService,
    private readonly businessService: BusinessService,
  ) {
    super();
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  public async getAffiliateProgram(
    @Query() query: AffiliatesProgramQueryDto,
  ): Promise<AffiliateProgramModel[]> {
    return this.affiliateProgramsService.getForAdmin(query);
  }

  @Get(AFFILIATES_BRANDING_ID)
  @HttpCode(HttpStatus.OK)
  public async getAffiliateProgramById(
    @ParamModel(AFFILIATES_BRANDING_ID, AffiliateProgramSchemaName, true) affiliateProgram: AffiliateProgramModel,
  ): Promise<AffiliateProgramModel> {
    return affiliateProgram;
  }

  @Post()
  @HttpCode(HttpStatus.OK)
  @Acl({ microservice: environment.microservice, action: AclActionsEnum.create })
  public async createAffiliateProgram(
    @Body() createAffiliateProgramDto: AdminAffiliateProgramDto,
  ): Promise<AffiliateProgramInterface & { applicationScopeElasticId: string; businessScopeElasticId: string }> {
    const business: BusinessModel = await this.businessService.findOneById(createAffiliateProgramDto.businessId);
    if (!business) { throw new NotFoundException(`business with id:'${createAffiliateProgramDto.businessId}' does not exist`); }

    return this.affiliateProgramsService.create(business, createAffiliateProgramDto);
  }


  @Patch(AFFILIATES_BRANDING_ID)
  @HttpCode(HttpStatus.OK)
  public async updateAffiliateProgram(
    @Body() updateAffiliateProgramDto: AffiliateProgramDto,
    @ParamModel(AFFILIATES_BRANDING_ID, AffiliateProgramSchemaName, true) affiliateProgram: AffiliateProgramModel,
  ): Promise<AffiliateProgramModel> {
    const businessId: string = affiliateProgram.business as any;
    const business: BusinessModel = await this.businessService.findOneById(businessId);
    if (!business) { throw new NotFoundException(`business with id:'${businessId}' does not exist`); }

    return this.affiliateProgramsService.update(business, affiliateProgram, updateAffiliateProgramDto);
  }

  @Delete(AFFILIATES_BRANDING_ID)
  @HttpCode(HttpStatus.OK)
  public async deleteAffiliateProgram(
    @User() user: AccessTokenPayload,
    @ParamModel(':affiliateProgramId', AffiliateProgramSchemaName, true) affiliateProgram: AffiliateProgramModel,
  ): Promise<void> {
    const businessId: string = affiliateProgram.business as any;
    const business: BusinessModel = await this.businessService.findOneById(businessId);
    if (!business) { throw new NotFoundException(`business with id:'${businessId}' does not exist`); }

    return this.affiliateProgramsService.delete(affiliateProgram);
  }
}
