import { Controller, HttpCode, HttpStatus, Post, UseGuards, Body, Get } from '@nestjs/common';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import {
  AbstractController,
  AccessTokenPayload, Acl, AclActionsEnum,
  JwtAuthGuard,
  ParamModel,
  Roles,
  RolesEnum,
  TokensResultModel,
  User,
} from '@pe/nest-kit';
import { BusinessModel, BusinessSchemaName } from '../../business';
import { ProductModel, SubscriptionPlanModel } from '../models';
import { Products, SubscriptionPlanService, ConnectionPlans } from '../services';
import { ProductHttpRequestDto, SubscriptionProductDto } from '../dto';
import { ProductSchemaName } from '../schemas';
import { ProductDelete, ProductUpdate } from '../voters';

const INVALID_CREDENTIALS_MESSAGE: string = 'Invalid credentials';

@Controller('products/:businessId')
@ApiTags('products')
@UseGuards(JwtAuthGuard)
@Roles(RolesEnum.merchant)
export class SubscriptionProductsController extends AbstractController {
  constructor(
    private readonly productService: Products,
    private readonly connectionPlansService: ConnectionPlans,
    private readonly subscriptionPlanService: SubscriptionPlanService,
  ) {
    super();
  }

  @Get('/:productId')
  @HttpCode(HttpStatus.OK)
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: INVALID_CREDENTIALS_MESSAGE })
  @ApiResponse({ status: HttpStatus.OK, type: TokensResultModel, description: '' })
  @Acl({ microservice: 'subscriptions', action: AclActionsEnum.read })
  public async getProduct(
    @User() user: AccessTokenPayload,
    @ParamModel('productId', ProductSchemaName, true) product: ProductModel,
  ): Promise<ProductModel> {
    return product;
  }

  @Post('/:productId')
  @HttpCode(HttpStatus.OK)
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: INVALID_CREDENTIALS_MESSAGE })
  @ApiResponse({ status: HttpStatus.OK, type: TokensResultModel, description: '' })
  @Acl({ microservice: 'subscriptions', action: AclActionsEnum.update })
  public async updateProduct(
    @User() user: AccessTokenPayload,
    @ParamModel('productId', ProductSchemaName, true) product: ProductModel,
    @Body() updatePlanSettingsDto: ProductHttpRequestDto,
  ): Promise<ProductModel> {
    await this.denyAccessUnlessGranted(ProductUpdate.UPDATE, product, user);

    return this.productService.updateProduct(updatePlanSettingsDto);
  }

  @Post()
  @HttpCode(HttpStatus.OK)
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: INVALID_CREDENTIALS_MESSAGE })
  @ApiResponse({ status: HttpStatus.OK, type: TokensResultModel, description: '' })
  @Acl({ microservice: 'subscriptions', action: AclActionsEnum.create })
  public async create(
    @User() user: AccessTokenPayload,
    @ParamModel('businessId', BusinessSchemaName, true) business: BusinessModel,
    @Body() productDto: SubscriptionProductDto,
  ): Promise<ProductModel> {
    return this.productService.createProduct(productDto, business);
  }

  @Post('/disable/:productId')
  @HttpCode(HttpStatus.OK)
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: INVALID_CREDENTIALS_MESSAGE })
  @ApiResponse({ status: HttpStatus.OK, type: TokensResultModel, description: '' })
  @Acl({ microservice: 'subscriptions', action: AclActionsEnum.update })
  public async disable(
    @User() user: AccessTokenPayload,
    @ParamModel('businessId', BusinessSchemaName, true) business: BusinessModel,
    @ParamModel('productId', ProductSchemaName, true) product: ProductModel,
  ): Promise<void> {
    await product.populate('business').execPopulate();
    await this.denyAccessUnlessGranted(ProductDelete.DELETE, product, user);

    const subscriptonPlans: SubscriptionPlanModel[] =
      await this.subscriptionPlanService.getSubscriptionPlanByProduct(product);
    if (subscriptonPlans.length > 0) {
      await this.subscriptionPlanService.removeSubscriptionPlansAndProduct(subscriptonPlans, product);
    }
    await this.productService.removeProduct(product);
  }
}
