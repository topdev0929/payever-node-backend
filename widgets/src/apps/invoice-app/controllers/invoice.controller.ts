import { Controller, Get, HttpCode, HttpStatus, UseGuards, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';
import {
  Acl, AclActionsEnum,
  JwtAuthGuard,
  ParamModel,
  Roles,
  RolesEnum,
} from '@pe/nest-kit';
import { BusinessModel } from '../../../business/models';
import { MongooseModel } from '../../../common/enums';
import { DateRevenueInterface } from '../interfaces';

import { BusinessInvoiceService } from '../services';
import { UserService } from '../../../user/services';
import { ParseOptionalIntPipe } from '../../../common/parse-optional-int.pipe';

@Controller('invoice-app')
@ApiTags('widget/invoice')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
@ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Invalid authorization token.' })
@ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Unauthorized.' })
export class InvoiceController {

  public constructor(
    private readonly businessInvoiceAppService: BusinessInvoiceService,

  ) { }

  @Get('business/:businessId/last-daily')
  @HttpCode(HttpStatus.OK)
  @Roles(RolesEnum.merchant)
  @ApiResponse({ status: HttpStatus.OK, description: 'The record has been successfully fetched.' })
  @Acl({ microservice: 'invoice', action: AclActionsEnum.read })
  public async retrieveBusinessLastDaily(
    @ParamModel('businessId', MongooseModel.Business) business: BusinessModel,
    @Query('numDays', ParseOptionalIntPipe) numDays?: number,
  ): Promise<DateRevenueInterface[]> {

    return this.businessInvoiceAppService.getLastDailyRevenues(business, numDays);
  }

  @Get('business/:businessId/last-monthly')
  @HttpCode(HttpStatus.OK)
  @Roles(RolesEnum.merchant)
  @ApiResponse({ status: HttpStatus.OK, description: 'The record has been successfully fetched.' })
  @Acl({ microservice: 'invoice', action: AclActionsEnum.read })
  public async retrieveBusinessLastMonthly(
    @ParamModel('businessId', MongooseModel.Business) business: BusinessModel,
    @Query('months', ParseOptionalIntPipe) months?: number,
  ): Promise<DateRevenueInterface[]> {

    return this.businessInvoiceAppService.getLastMonthlyRevenues(business, months);
  }
}
