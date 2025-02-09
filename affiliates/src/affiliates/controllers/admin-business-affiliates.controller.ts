import {
  Body,
  Query,
  Controller,
  Delete, Patch,
  HttpCode,
  HttpStatus,
  Post,
  Get,
  UseGuards,
} from '@nestjs/common';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import {
  AbstractController,
  JwtAuthGuard,
  ParamModel,
  Roles,
  RolesEnum,
  TokensResultModel,
} from '@pe/nest-kit';
import { BusinessAffiliatesService } from '../services';
import { BusinessAffiliateModel } from '../models';
import { BusinessAffiliateSchemaName } from '../schemas';
import { AdminBusinessAffiliateDto, BusinessAffiliateQueryDto } from '../dto';

const INVALID_CREDENTIALS_MESSAGE: string = 'Invalid credentials';
const BUSINESS_AFFILIATE_ID: string = ':businessAffiliateId';

@Controller('admin/business-affiliates')
@ApiTags('admin affiliates')
@UseGuards(JwtAuthGuard)
@Roles(RolesEnum.admin)
@ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: INVALID_CREDENTIALS_MESSAGE })
@ApiResponse({ status: HttpStatus.OK, type: TokensResultModel, description: '' })
export class AdminBusinessAffiliatesController extends AbstractController {
  constructor(
    private readonly businessAffiliatesService: BusinessAffiliatesService,
  ) {
    super();
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  public async getBusinessAffiliates(
    @Query() query: BusinessAffiliateQueryDto,
  ): Promise<any> {
    return this.businessAffiliatesService.getForAdmin(query);
  }

  @Get(BUSINESS_AFFILIATE_ID)
  @HttpCode(HttpStatus.OK)
  public async getBusinessAffiliateById(
    @ParamModel(BUSINESS_AFFILIATE_ID, BusinessAffiliateSchemaName, true)
    businessAffiliate: BusinessAffiliateModel,
  ): Promise<any> {
    return businessAffiliate;
  }

  @Post()
  @HttpCode(HttpStatus.OK)
  public async createBusinessAffiliate(
    @Body() createAffiliateDto: AdminBusinessAffiliateDto,
  ): Promise<BusinessAffiliateModel> {
    return this.businessAffiliatesService.createForAdmin(createAffiliateDto);
  }

  @Patch(BUSINESS_AFFILIATE_ID)
  @HttpCode(HttpStatus.OK)
  public async updateBusinessAffiliate(
    @Body() updaetBusinessAffiliateDto: AdminBusinessAffiliateDto,
    @ParamModel(BUSINESS_AFFILIATE_ID, BusinessAffiliateSchemaName, true)
    businessAffiliate: BusinessAffiliateModel,
  ): Promise<BusinessAffiliateModel> {
    return this.businessAffiliatesService.updateForAdmin(businessAffiliate._id, updaetBusinessAffiliateDto);
  }

  @Delete(BUSINESS_AFFILIATE_ID)
  @HttpCode(HttpStatus.OK)
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: INVALID_CREDENTIALS_MESSAGE })
  @ApiResponse({ status: HttpStatus.OK, type: TokensResultModel, description: '' })
  public async deleteBusinessAffiliate(
    @ParamModel(BUSINESS_AFFILIATE_ID, BusinessAffiliateSchemaName, true)
    businessAffiliate: BusinessAffiliateModel,
  ): Promise<void> {
    return this.businessAffiliatesService.delete(businessAffiliate);
  }
}
