import { Controller, Get, HttpCode, HttpStatus, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Acl, AclActionsEnum, JwtAuthGuard, ParamModel, Roles, RolesEnum } from '@pe/nest-kit';
import { BusinessModel } from '../../../business/models';
import { MongooseModel as CommonMongooseModel } from '../../../common/enums';
import { ProductModel } from '../models';
import { BusinessProductsAppService } from '../services';
import { Randomizer } from '../tools/randomizer';

const RecordFetched: string = 'The record has been successfully fetched.';

@Controller('products-app/business/:businessId')
@ApiTags('widget')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
@ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Invalid authorization token.' })
@ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Unauthorized.' })
export class BusinessProductsController {

  public constructor(
    private readonly productsAppService: BusinessProductsAppService,
  ) { }

  @Get('popular-week')
  @HttpCode(HttpStatus.OK)
  @Roles(RolesEnum.merchant)
  @Acl({ microservice: 'commerceos', action: AclActionsEnum.read })
  @ApiResponse({ status: HttpStatus.OK, description: RecordFetched })
  public async retrievePopularWeek(
    @ParamModel('businessId', CommonMongooseModel.Business) business: BusinessModel,
  ): Promise<ProductModel[]> {
    return this.productsAppService.getPopularLastWeek(business);
  }

  @Get('popular-month')
  @HttpCode(HttpStatus.OK)
  @Roles(RolesEnum.merchant)
  @Acl({ microservice: 'commerceos', action: AclActionsEnum.read })
  @ApiResponse({ status: HttpStatus.OK, description: RecordFetched })
  public async retrievePopularMonth(
    @ParamModel('businessId', CommonMongooseModel.Business) business: BusinessModel,
  ): Promise<ProductModel[]> {
    return this.productsAppService.getPopularLastMonth(business);
  }

  @Get('popular-total')
  @HttpCode(HttpStatus.OK)
  @Roles(RolesEnum.merchant)
  @Acl({ microservice: 'commerceos', action: AclActionsEnum.read })
  @ApiResponse({ status: HttpStatus.OK, description: RecordFetched })
  public async retrievePopularTotal(
    @ParamModel('businessId', CommonMongooseModel.Business) business: BusinessModel,
  ): Promise<ProductModel[]> {
    return this.productsAppService.getPopularTotal(business);
  }

  @Get('last-sold')
  @HttpCode(HttpStatus.OK)
  @Roles(RolesEnum.merchant)
  @Acl({ microservice: 'commerceos', action: AclActionsEnum.read })
  @ApiResponse({ status: HttpStatus.OK, description: RecordFetched })
  public async retrieveLast(
    @ParamModel('businessId', CommonMongooseModel.Business) business: BusinessModel,
  ): Promise<ProductModel[]> {
    return this.productsAppService.getLastSold(business);
  }

  @Get('popular-week/random')
  @HttpCode(HttpStatus.OK)
  @Roles(RolesEnum.merchant)
  @Acl({ microservice: 'commerceos', action: AclActionsEnum.read })
  @ApiResponse({ status: HttpStatus.OK, description: RecordFetched })
  public async retrieveRandomPopularWeek(
    @ParamModel('businessId', CommonMongooseModel.Business) business: BusinessModel,
  ): Promise<Array<{ }>> {
    return Randomizer.shuffleArray(await this.productsAppService.getPopularLastWeek(business))
      .map((item: ProductModel) => ({
        ...item.toObject(),
        lastSell: item.lastSell ? item.lastSell : (new Date()).toJSON(),
        quantity: item.quantity ? item.quantity : 0,
      }));
  }

  @Get('popular-month/random')
  @HttpCode(HttpStatus.OK)
  @Roles(RolesEnum.merchant)
  @Acl({ microservice: 'commerceos', action: AclActionsEnum.read })
  @ApiResponse({ status: HttpStatus.OK, description: RecordFetched })
  public async retrieveRandomPopularMonth(
    @ParamModel('businessId', CommonMongooseModel.Business) business: BusinessModel,
  ): Promise<Array<{ }>> {
    return Randomizer.shuffleArray(await this.productsAppService.getPopularLastMonth(business))
      .map((item: ProductModel) => ({
        ...item.toObject(),
        lastSell: item.lastSell ? item.lastSell : (new Date()).toJSON(),
        quantity: item.quantity ? item.quantity : 0,
      }));
  }

  @Get('popular-total/random')
  @HttpCode(HttpStatus.OK)
  @Roles(RolesEnum.merchant)
  @Acl({ microservice: 'commerceos', action: AclActionsEnum.read })
  @ApiResponse({ status: HttpStatus.OK, description: RecordFetched })
  public async retrieveRandomPopularTotal(
    @ParamModel('businessId', CommonMongooseModel.Business) business: BusinessModel,
  ): Promise<Array<{ }>> {
    return Randomizer.shuffleArray(
      await this.productsAppService.getPopularTotal(business),
    ).map((item: ProductModel) => ({
      ...item.toObject(),
      lastSell: item.lastSell ? item.lastSell : (new Date()).toJSON(),
      quantity: item.quantity ? item.quantity : 0,
    }));
  }

  @Get('last-sold/random')
  @HttpCode(HttpStatus.OK)
  @Roles(RolesEnum.merchant)
  @Acl({ microservice: 'commerceos', action: AclActionsEnum.read })
  @ApiResponse({ status: HttpStatus.OK, description: RecordFetched })
  public async retrieveRandomLast(
    @ParamModel('businessId', CommonMongooseModel.Business) business: BusinessModel,
  ): Promise<Array<{ }>> {
    return Randomizer.shuffleArray(await this.productsAppService.getLastSold(business))
      .map((item: ProductModel) => ({
        ...item.toObject(),
        lastSell: item.lastSell ? item.lastSell : (new Date()).toJSON(),
        quantity: item.quantity ? item.quantity : 0,
      }));
  }
}
