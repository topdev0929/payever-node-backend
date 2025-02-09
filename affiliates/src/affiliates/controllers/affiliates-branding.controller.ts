import { Body, Controller, Delete, HttpCode, HttpStatus, Post, Get, Patch, UseGuards, Query } from '@nestjs/common';
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
import { AffiliateBrandingsService } from '../services';
import { AffiliateBrandingModel } from '../models';
import { AffiliateBrandingDto, AppWithAccessConfigDto, IsValidNameDto } from '../dto';
import { AffiliateBrandingSchemaName } from '../schemas';
import { environment } from '../../environments';
import { ValidateAffiliateNameResponseInterface } from '../interfaces';

const INVALID_CREDENTIALS_MESSAGE: string = 'Invalid credentials';
const BUSINESS_PLACEHOLDER: string = ':businessId';
const AFFILIATES_BRANDING_PLACEHOLDER: string = ':affiliateBrandingId';

@Controller('business/:businessId/affiliates-branding')
@ApiTags('affiliate brandings')
@UseGuards(JwtAuthGuard)
@Roles(RolesEnum.merchant)
export class AffiliateBrandingsController extends AbstractController {
  constructor(
    private readonly affiliateBrandingsService: AffiliateBrandingsService,
  ) {
    super();
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: INVALID_CREDENTIALS_MESSAGE })
  @ApiResponse({ status: HttpStatus.OK, type: TokensResultModel, description: '' })
  @Acl({ microservice: environment.microservice, action: AclActionsEnum.read })
  public async getAffiliateBranding(
    @ParamModel(BUSINESS_PLACEHOLDER, BusinessSchemaName, true) business: BusinessModel,
  ): Promise<AffiliateBrandingModel[]> {
    return this.affiliateBrandingsService.getByBusiness(business);
  }

  @Get('/:affiliateBrandingId')
  @HttpCode(HttpStatus.OK)
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: INVALID_CREDENTIALS_MESSAGE })
  @ApiResponse({ status: HttpStatus.OK, type: TokensResultModel, description: '' })
  @Acl({ microservice: environment.microservice, action: AclActionsEnum.read })
  public async getAffiliateBrandingById(
    @ParamModel(
      {
        _id: AFFILIATES_BRANDING_PLACEHOLDER,
        business: BUSINESS_PLACEHOLDER,
      }, 
      AffiliateBrandingSchemaName, 
      true,
    ) 
    affiliateBranding: AffiliateBrandingModel,
  ): Promise<AppWithAccessConfigDto> {
    return this.affiliateBrandingsService.appWithAccessConfig(affiliateBranding);
  }

  @Get('/default')
  @HttpCode(HttpStatus.OK)
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: INVALID_CREDENTIALS_MESSAGE })
  @ApiResponse({ status: HttpStatus.OK, type: TokensResultModel, description: '' })
  @Acl({ microservice: environment.microservice, action: AclActionsEnum.read })
  public async getDefaultAffiliateBranding(
    @ParamModel(BUSINESS_PLACEHOLDER, BusinessSchemaName, true) business: BusinessModel,
  ): Promise<AffiliateBrandingModel> {
    return this.affiliateBrandingsService.getDefault(business);
  }

  @Post()
  @HttpCode(HttpStatus.OK)
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: INVALID_CREDENTIALS_MESSAGE })
  @ApiResponse({ status: HttpStatus.OK, type: TokensResultModel, description: '' })
  @Acl({ microservice: environment.microservice, action: AclActionsEnum.create })
  public async createAffiliateBranding(
    @Body() createAffiliateBrandingDto: AffiliateBrandingDto,
    @ParamModel(BUSINESS_PLACEHOLDER, BusinessSchemaName, true) business: BusinessModel,
  ): Promise<AffiliateBrandingModel> {
    return this.affiliateBrandingsService.create(business, createAffiliateBrandingDto);
  }

  @Patch('/:affiliateBrandingId')
  @HttpCode(HttpStatus.OK)
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: INVALID_CREDENTIALS_MESSAGE })
  @ApiResponse({ status: HttpStatus.OK, type: TokensResultModel, description: '' })
  @Acl({ microservice: environment.microservice, action: AclActionsEnum.update })
  public async updateAffiliateBranding(
    @Body() updateAffiliateBrandingDto: AffiliateBrandingDto,
    @ParamModel(
      {
        _id: AFFILIATES_BRANDING_PLACEHOLDER,
        business: BUSINESS_PLACEHOLDER,
      }, 
      AffiliateBrandingSchemaName, 
      true,
    ) 
    affiliateBranding: AffiliateBrandingModel,
    @ParamModel(BUSINESS_PLACEHOLDER, BusinessSchemaName, true) business: BusinessModel,
  ): Promise<AffiliateBrandingModel> {
    return this.affiliateBrandingsService.update(affiliateBranding, updateAffiliateBrandingDto, business);
  }

  @Patch('/:affiliateBrandingId/default')
  @HttpCode(HttpStatus.OK)
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: INVALID_CREDENTIALS_MESSAGE })
  @ApiResponse({ status: HttpStatus.OK, type: TokensResultModel, description: '' })
  @Acl({ microservice: environment.microservice, action: AclActionsEnum.update })
  public async setAffiliateBrandingAsDefault(
    @ParamModel(BUSINESS_PLACEHOLDER, BusinessSchemaName, true) business: BusinessModel,
    @ParamModel(
      {
        _id: AFFILIATES_BRANDING_PLACEHOLDER,
        business: BUSINESS_PLACEHOLDER,
      }, 
      AffiliateBrandingSchemaName, 
      true,
    ) 
    affiliateBranding: AffiliateBrandingModel,
  ): Promise<AffiliateBrandingModel> {
    return this.affiliateBrandingsService.setDefault(affiliateBranding._id, business._id);
  }

  @Delete('/:affiliateBrandingId')
  @HttpCode(HttpStatus.OK)
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: INVALID_CREDENTIALS_MESSAGE })
  @ApiResponse({ status: HttpStatus.OK, type: TokensResultModel, description: '' })
  @Acl({ microservice: environment.microservice, action: AclActionsEnum.delete })
  public async deleteAffiliateBranding(
    @User() user: AccessTokenPayload,
    @ParamModel(
      {
        _id: AFFILIATES_BRANDING_PLACEHOLDER,
        business: BUSINESS_PLACEHOLDER,
      }, 
      AffiliateBrandingSchemaName, 
      true,
    ) 
    affiliateBranding: AffiliateBrandingModel,
  ): Promise<void> {

    return this.affiliateBrandingsService.delete(affiliateBranding);
  }

  @Get('isValidName')
  @Roles(RolesEnum.merchant)
  @Acl({ microservice: environment.microservice, action: AclActionsEnum.read })
  public async isValidName(
    @ParamModel('businessId', BusinessSchemaName) business: BusinessModel,
    @Query() isValidNameDto: IsValidNameDto,
  ): Promise<ValidateAffiliateNameResponseInterface> {
    return this.affiliateBrandingsService.isBrandingNameAvailable(isValidNameDto.name, business, null);
  }
}
