import { Body, Controller, Delete, HttpCode, HttpStatus, Post, Get, UseGuards } from '@nestjs/common';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import {
  AbstractController,
  AccessTokenPayload,
  AclActionsEnum,
  JwtAuthGuard,
  ParamModel,
  Roles,
  RolesEnum,
  TokensResultModel,
  User,
  Acl,
} from '@pe/nest-kit';
import { BusinessSchemaName, BusinessModel } from '@pe/business-kit';
import { BusinessAffiliatesService } from '../services';
import { AffiliateModel, BusinessAffiliateModel } from '../models';
import { AffiliateDto } from '../dto';
import { AffiliateSchemaName, BusinessAffiliateSchemaName } from '../schemas';
import { BusinessAffiliateEditVoter } from '../voters';
import { environment } from '../../environments';

const INVALID_CREDENTIALS_MESSAGE: string = 'Invalid credentials';

@Controller('business/:businessId/affiliates')
@ApiTags('affiliates')
@UseGuards(JwtAuthGuard)
@Roles(RolesEnum.merchant)
export class BusinessAffiliatesController extends AbstractController {
  constructor(
    private readonly businessAffiliatesService: BusinessAffiliatesService,
  ) {
    super();
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: INVALID_CREDENTIALS_MESSAGE })
  @ApiResponse({ status: HttpStatus.OK, type: TokensResultModel, description: '' })
  @Acl({ microservice: environment.microservice, action: AclActionsEnum.read })
  public async getBusinessAffiliate(
    @ParamModel(':businessId', BusinessSchemaName, true) business: BusinessModel,
  ): Promise<BusinessAffiliateModel[]> {
    return this.businessAffiliatesService.get(business);
  }

  @Get(':affiliateId')
  @HttpCode(HttpStatus.OK)
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: INVALID_CREDENTIALS_MESSAGE })
  @ApiResponse({ status: HttpStatus.OK, type: TokensResultModel, description: '' })
  @Acl({ microservice: environment.microservice, action: AclActionsEnum.read })
  public async getBusinessAffiliateByAffiliateId(
    @ParamModel(':businessId', BusinessSchemaName, true) business: BusinessModel,
    @ParamModel(':affiliateId', AffiliateSchemaName, true) affiliate: AffiliateModel,
  ): Promise<BusinessAffiliateModel> {
    return this.businessAffiliatesService.getByBusinessAndAffiliate(business, affiliate);
  }

  @Post()
  @HttpCode(HttpStatus.OK)
  @Acl({ microservice: environment.microservice, action: AclActionsEnum.create })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: INVALID_CREDENTIALS_MESSAGE })
  @ApiResponse({ status: HttpStatus.OK, type: TokensResultModel, description: '' })
  public async createBusinessAffiliate(
    @Body() createAffiliateDto: AffiliateDto,
    @ParamModel(':businessId', BusinessSchemaName, true) business: BusinessModel,
  ): Promise<BusinessAffiliateModel> {
    return this.businessAffiliatesService.create(business, createAffiliateDto);
  }

  @Delete('/:businessAffiliateId')
  @HttpCode(HttpStatus.OK)
  @Acl({ microservice: environment.microservice, action: AclActionsEnum.delete })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: INVALID_CREDENTIALS_MESSAGE })
  @ApiResponse({ status: HttpStatus.OK, type: TokensResultModel, description: '' })
  public async deleteBusinessAffiliate(
    @User() user: AccessTokenPayload,
    @ParamModel(':businessAffiliateId', BusinessAffiliateSchemaName, true) businessAffiliate: BusinessAffiliateModel,
  ): Promise<void> {
    await this.denyAccessUnlessGranted(BusinessAffiliateEditVoter.EDIT, businessAffiliate, user);

    return this.businessAffiliatesService.delete(businessAffiliate);
  }
}
