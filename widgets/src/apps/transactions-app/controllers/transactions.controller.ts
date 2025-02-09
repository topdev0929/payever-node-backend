import { Controller, Get, HttpCode, HttpStatus, UseGuards, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';
import {
  Acl, AclActionsEnum,
  JwtAuthGuard,
  ParamModel,
  Roles,
  RolesEnum,
  User,
  UserTokenInterface,
} from '@pe/nest-kit';
import { BusinessModel } from '../../../business/models';
import { MongooseModel } from '../../../common/enums';
import { DateRevenueInterface } from '../interfaces';

import { BusinessTransactionsService, UserTransactionsService, UserPerBusinessTransactionsService } from '../services';
import { UserModel } from '../../../user/models';
import { UserService } from '../../../user/services';
import { ParseOptionalIntPipe } from '../../../common/parse-optional-int.pipe';

@Controller('transactions-app')
@ApiTags('widget/transactions')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
@ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Invalid authorization token.' })
@ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Unauthorized.' })
export class TransactionsController {

  public constructor(
    private readonly businessTransactionsAppService: BusinessTransactionsService,
    private readonly userService: UserService,
    private readonly userTransactionsAppService: UserTransactionsService,
    private readonly userPerBusinessTransactionsService: UserPerBusinessTransactionsService,
  ) { }

  @Get('business/:businessId/last-daily')
  @HttpCode(HttpStatus.OK)
  @Roles(RolesEnum.merchant)
  @ApiResponse({ status: HttpStatus.OK, description: 'The record has been successfully fetched.' })
  @Acl({ microservice: 'transactions', action: AclActionsEnum.read })
  public async retrieveBusinessLastDaily(
    @ParamModel('businessId', MongooseModel.Business) business: BusinessModel,
    @Query('numDays', ParseOptionalIntPipe) numDays?: number,
  ): Promise<DateRevenueInterface[]> {

    return this.businessTransactionsAppService.getLastDailyRevenues(business, numDays);
  }

  @Get('business/:businessId/last-monthly')
  @HttpCode(HttpStatus.OK)
  @Roles(RolesEnum.merchant)
  @ApiResponse({ status: HttpStatus.OK, description: 'The record has been successfully fetched.' })
  @Acl({ microservice: 'transactions', action: AclActionsEnum.read })
  public async retrieveBusinessLastMonthly(
    @ParamModel('businessId', MongooseModel.Business) business: BusinessModel,
    @Query('months', ParseOptionalIntPipe) months?: number,
  ): Promise<DateRevenueInterface[]> {

    return this.businessTransactionsAppService.getLastMonthlyRevenues(business, months);
  }

  @Get('business/:businessId/user/:userId/last-daily')
  @HttpCode(HttpStatus.OK)
  @Roles(RolesEnum.merchant)
  @ApiResponse({ status: HttpStatus.OK, description: '' })
  @Acl({ microservice: 'transactions', action: AclActionsEnum.read })
  public async retrieveUserPerBusinessLastDaily(
    @ParamModel('businessId', MongooseModel.Business) business: BusinessModel,
    @ParamModel('userId', MongooseModel.User) user: UserModel,
    @Query('numDays', ParseOptionalIntPipe) numDays?: number,
  ): Promise<DateRevenueInterface[]> {
    return this.userPerBusinessTransactionsService.getLastDailyRevenues(
      user,
      business,
      numDays,
    );
  }

  @Get('business/:businessId/user/:userId/last-monthly')
  @HttpCode(HttpStatus.OK)
  @Roles(RolesEnum.merchant)
  @ApiResponse({ status: HttpStatus.OK, description: '' })
  @Acl({ microservice: 'transactions', action: AclActionsEnum.read })
  public async retrieveUserPerBusinessLastMonthly(
    @ParamModel('businessId', MongooseModel.Business) business: BusinessModel,
    @ParamModel('userId', MongooseModel.User) user: UserModel,
    @Query('months', ParseOptionalIntPipe) months?: number,
  ): Promise<DateRevenueInterface[]> {
    return this.userPerBusinessTransactionsService.getLastMonthlyRevenues(
      user,
      business,
      months,
    );
  }

  @Get('personal/last-daily')
  @HttpCode(HttpStatus.OK)
  @ApiTags('user')
  @Roles(RolesEnum.user)
  @ApiResponse({ status: HttpStatus.OK, description: 'The record has been successfully fetched.' })
  public async retrieveUserLastDaily(
    @User() userToken: UserTokenInterface,
    @Query('numDays', ParseOptionalIntPipe) numDays?: number,
  ): Promise<DateRevenueInterface[]> {
    const user: UserModel = await this.userService.findOneById(userToken.id);

    return this.userTransactionsAppService.getLastDailyRevenues(user, numDays);
  }

  @Get('personal/last-monthly')
  @HttpCode(HttpStatus.OK)
  @ApiTags('user')
  @Roles(RolesEnum.user)
  @ApiResponse({ status: HttpStatus.OK, description: 'The record has been successfully fetched.' })
  public async retrieveUserLastMonthly(
    @User() userToken: UserTokenInterface,
    @Query('months', ParseOptionalIntPipe) months?: number,
  ): Promise<DateRevenueInterface[]> {
    const user: UserModel = await this.userService.findOneById(userToken.id);

    return this.userTransactionsAppService.getLastMonthlyRevenues(user, months);
  }
}
