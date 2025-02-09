import { Controller, Get, HttpCode, HttpStatus, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ParamModel, Roles, JwtAuthGuard, RolesEnum, Acl, AclActionsEnum } from '@pe/nest-kit';

import { BusinessModel } from '../../../business/models';
import { MongooseModel as CommonMongooseModel } from '../../../common/enums';
import { MongooseModel as StatisticsMongooseModel } from '../../../statistics/enum';
import { ChannelSetModel } from '../../../statistics/models';
import { ProductModel } from '../models';
import { ChannelSetProductsAppService } from '../services';

@Controller('products-app/business/:businessId/channel-set/:channelSetId')
@ApiTags('widget')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
@ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Invalid authorization token.' })
@ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Unauthorized.' })
export class ChannelSetProductsController {

  public constructor(
    private readonly productsAppService: ChannelSetProductsAppService,
  ) { }

  @Get('popular-week')
  @HttpCode(HttpStatus.OK)
  @Roles(RolesEnum.merchant)
  @ApiResponse({ status: HttpStatus.OK, description: 'The record has been successfully fetched.' })
  @Acl({ microservice: 'pos', action: AclActionsEnum.read })
  public async retrievePopularWeek(
    @ParamModel('businessId', CommonMongooseModel.Business) business: BusinessModel,
    @ParamModel('channelSetId', StatisticsMongooseModel.ChannelSet) channelSet: ChannelSetModel,
  ): Promise<ProductModel[]> {
    return this.productsAppService.getPopularLastWeek(channelSet);
  }

  @Get('popular-month')
  @HttpCode(HttpStatus.OK)
  @Roles(RolesEnum.merchant)
  @ApiResponse({ status: HttpStatus.OK, description: 'The record has been successfully fetched.' })
  public async retrievePopularMonth(
    @ParamModel('businessId', CommonMongooseModel.Business) business: BusinessModel,
    @ParamModel('channelSetId', StatisticsMongooseModel.ChannelSet) channelSet: ChannelSetModel,
  ): Promise<ProductModel[]> {
    return this.productsAppService.getPopularLastMonth(channelSet);
  }

  @Get('last-sold')
  @HttpCode(HttpStatus.OK)
  @Roles(RolesEnum.merchant)
  @ApiResponse({ status: HttpStatus.OK, description: 'The record has been successfully fetched.' })
  public async retrieveLast(
    @ParamModel('businessId', CommonMongooseModel.Business) business: BusinessModel,
    @ParamModel('channelSetId', StatisticsMongooseModel.ChannelSet) channelSet: ChannelSetModel,
  ): Promise<ProductModel[]> {
    return this.productsAppService.getLastSold(channelSet);
  }
}
