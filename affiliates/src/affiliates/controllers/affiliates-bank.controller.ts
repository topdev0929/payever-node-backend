import { Body, Controller, Delete, HttpCode, HttpStatus, Post, Get, Patch, UseGuards } from '@nestjs/common';
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
import { AffiliateBanksService } from '../services';
import { AffiliateBankModel } from '../models';
import { AffiliateBankDto } from '../dto';
import { AffiliateBankSchemaName } from '../schemas';
import { environment } from '../../environments';

const INVALID_CREDENTIALS_MESSAGE: string = 'Invalid credentials';
@Controller('business/:businessId/affiliates-bank')
@ApiTags('affiliate banks')
@UseGuards(JwtAuthGuard)
@Roles(RolesEnum.merchant)
export class AffiliateBanksController extends AbstractController {
  constructor(
    private readonly affiliateBanksService: AffiliateBanksService,
  ) {
    super();
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: INVALID_CREDENTIALS_MESSAGE })
  @ApiResponse({ status: HttpStatus.OK, type: TokensResultModel, description: '' })
  @Acl({ microservice: environment.microservice, action: AclActionsEnum.read })
  public async getAffiliateBank(
    @ParamModel(':businessId', BusinessSchemaName, true) business: BusinessModel,
  ): Promise<AffiliateBankModel[]> {
    return this.affiliateBanksService.getByBusiness(business);
  }

  @Post()
  @HttpCode(HttpStatus.OK)
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: INVALID_CREDENTIALS_MESSAGE })
  @ApiResponse({ status: HttpStatus.OK, type: TokensResultModel, description: '' })
  @Acl({ microservice: environment.microservice, action: AclActionsEnum.create })
  public async createAffiliateBank(
    @Body() createAffiliateBankDto: AffiliateBankDto,
    @ParamModel(':businessId', BusinessSchemaName, true) business: BusinessModel,
  ): Promise<AffiliateBankModel> {
    return this.affiliateBanksService.create(business, createAffiliateBankDto);
  }

  @Patch('/:affiliateBankId')
  @HttpCode(HttpStatus.OK)
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: INVALID_CREDENTIALS_MESSAGE })
  @ApiResponse({ status: HttpStatus.OK, type: TokensResultModel, description: '' })
  @Acl({ microservice: environment.microservice, action: AclActionsEnum.update })
  public async updateAffiliateBank(
    @Body() updateAffiliateBankDto: AffiliateBankDto,
    @ParamModel(':affiliateBankId', AffiliateBankSchemaName, true) affiliateBank: AffiliateBankModel,
  ): Promise<AffiliateBankModel> {
    return this.affiliateBanksService.update(affiliateBank, updateAffiliateBankDto);
  }

  @Delete('/:affiliateBankId')
  @HttpCode(HttpStatus.OK)
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: INVALID_CREDENTIALS_MESSAGE })
  @ApiResponse({ status: HttpStatus.OK, type: TokensResultModel, description: '' })
  @Acl({ microservice: environment.microservice, action: AclActionsEnum.delete })
  public async deleteAffiliateBank(
    @User() user: AccessTokenPayload,
    @ParamModel(':affiliateBankId', AffiliateBankSchemaName, true) affiliateBank: AffiliateBankModel,
  ): Promise<void> {

    return this.affiliateBanksService.delete(affiliateBank);
  }
}
