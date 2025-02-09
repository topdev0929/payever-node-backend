import { Controller, Get, HttpCode, HttpStatus, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Acl, AclActionsEnum, JwtAuthGuard, ParamModel, Roles, RolesEnum } from '@pe/nest-kit';
import { BusinessModel } from '../../../business/models';
import { MongooseModel } from '../../../common/enums';

import { ParseOptionalIntPipe } from '../../../common/parse-optional-int.pipe';
import { ChannelSetModel } from '../../../statistics/models';
import { DateRevenueInterface } from '../interfaces';
import { ChannelSetTransactionsService } from '../services';

@Controller('transactions-app/business/:businessId/channel-set/:channelSetId')
@ApiTags('widget')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
@ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Invalid authorization token.' })
@ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Unauthorized.' })
export class ChannelSetTransactionsController {

  public constructor(
    private readonly channelSetTransactionsService: ChannelSetTransactionsService,
  ) { }

  @Get('last-daily')
  @HttpCode(HttpStatus.OK)
  @Roles(RolesEnum.merchant)
  @ApiResponse({ status: HttpStatus.OK, description: 'The record has been successfully fetched.' })
  @Acl({ microservice: 'pos', action: AclActionsEnum.read })
  public async retrieveLastDaily(
    @ParamModel('businessId', MongooseModel.Business) business: BusinessModel,
    @ParamModel('channelSetId', MongooseModel.ChannelSet) channelSet: ChannelSetModel,
    @Query('numDays', ParseOptionalIntPipe) numDays?: number,
  ): Promise<DateRevenueInterface[]> {

    return this.channelSetTransactionsService.getLastDailyRevenues(channelSet, numDays);
  }

  @Get('last-monthly')
  @HttpCode(HttpStatus.OK)
  @Roles(RolesEnum.merchant)
  @Acl({ microservice: 'transactions', action: AclActionsEnum.read })
  @ApiResponse({ status: HttpStatus.OK, description: 'The record has been successfully fetched.' })
  public async retrieveLastMonthly(
    @ParamModel('businessId', MongooseModel.Business) business: BusinessModel,
    @ParamModel('channelSetId', MongooseModel.ChannelSet) channelSet: ChannelSetModel,
    @Query('months', ParseOptionalIntPipe) months?: number,
  ): Promise<DateRevenueInterface[]> {

    return this.channelSetTransactionsService.getLastMonthlyRevenues(channelSet, months);
  }
}
