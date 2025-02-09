import { Body, Controller, HttpCode, HttpStatus, Post, Get, Patch, UseGuards } from '@nestjs/common';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import {
  AbstractController,
  Acl,
  AclActionsEnum,
  JwtAuthGuard,
  ParamModel,
  Roles,
  RolesEnum,
  TokensResultModel,
} from '@pe/nest-kit';
import { BusinessSchemaName, BusinessModel } from '@pe/business-kit';
import { BusinessPaymentsService } from '../services';
import { BusinessPaymentsModel } from '../models';
import { BusinessPaymentsDto } from '../dto';
import { environment } from '../../environments';

const INVALID_CREDENTIALS_MESSAGE: string = 'Invalid credentials';

@Controller('business/:businessId/payments')
@ApiTags('business payments')
@UseGuards(JwtAuthGuard)
@Roles(RolesEnum.merchant)
export class BusinessPaymentsController extends AbstractController {
  constructor(
    private readonly businessPaymentsService: BusinessPaymentsService,
  ) {
    super();
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: INVALID_CREDENTIALS_MESSAGE })
  @ApiResponse({ status: HttpStatus.OK, type: TokensResultModel, description: '' })
  @Acl({ microservice: environment.microservice, action: AclActionsEnum.read })
  public async getBusinessPayments(
    @ParamModel(':businessId', BusinessSchemaName, true) business: BusinessModel,
  ): Promise<BusinessPaymentsModel> {
    return this.businessPaymentsService.getByBusiness(business);
  }

  @Post()
  @HttpCode(HttpStatus.OK)
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: INVALID_CREDENTIALS_MESSAGE })
  @ApiResponse({ status: HttpStatus.OK, type: TokensResultModel, description: '' })
  @Acl({ microservice: environment.microservice, action: AclActionsEnum.create })
  public async createBusinessPayments(
    @Body() createBusinessPaymentsDto: BusinessPaymentsDto,
    @ParamModel(':businessId', BusinessSchemaName, true) business: BusinessModel,
  ): Promise<BusinessPaymentsModel> {
    return this.businessPaymentsService.create(business, createBusinessPaymentsDto);
  }

  @Patch()
  @HttpCode(HttpStatus.OK)
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: INVALID_CREDENTIALS_MESSAGE })
  @ApiResponse({ status: HttpStatus.OK, type: TokensResultModel, description: '' })
  @Acl({ microservice: environment.microservice, action: AclActionsEnum.update })
  public async updateBusinessPayments(
    @Body() updateBusinessPaymentsDto: BusinessPaymentsDto,
    @ParamModel(':businessId', BusinessSchemaName, true) business: BusinessModel,
  ): Promise<BusinessPaymentsModel> {
    return this.businessPaymentsService.update(business, updateBusinessPaymentsDto);
  }
}
