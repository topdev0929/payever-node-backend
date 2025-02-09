import { BadRequestException, Body, Controller, Delete, Post, UseGuards } from '@nestjs/common';
import { ProductModel } from '../../interfaces';
import { AbstractController, Acl, AclActionsEnum, JwtAuthGuard, ParamModel, Roles, RolesEnum } from '@pe/nest-kit';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { BusinessSchemaName, ProductSchemaName } from '../../schemas';
import { BusinessModel, ProductSubscriptionModel } from '../../interfaces/entities';
import { ProductSubscriptionsService } from '../../services';
import { CreateSubscriptionDto } from '../../dto';

@Controller('/business/:businessId/products/:productId/subscription')
@ApiTags('subscription')
@UseGuards(JwtAuthGuard)
@Roles(RolesEnum.merchant)
export class ProductSubscriptionsController extends AbstractController {
  constructor(
    private readonly productSubscriptionsService: ProductSubscriptionsService,
  ) {
    super();
  }

  @Post()
  @Acl({ microservice: 'marketplace', action: AclActionsEnum.create })
  @ApiOperation({ summary: 'subscribeToProduct', description: 'Add subscription to product' })
  public async subscribeToProduct(
    @ParamModel(':productId', ProductSchemaName, true) product: ProductModel,
    @ParamModel(':businessId', BusinessSchemaName, true) business: BusinessModel,
    @Body() createSubscriptionDto: CreateSubscriptionDto,
  ): Promise<ProductSubscriptionModel> {
    if (product.businessId === business.id) {
      throw new BadRequestException(`Can't subscribe on own product`);
    }

    return this.productSubscriptionsService.subscribeToProduct(product, business, createSubscriptionDto);
  }

  @Delete()
  @Acl({ microservice: 'marketplace', action: AclActionsEnum.delete })
  @ApiOperation({ summary: 'unsubscribeFromProduct', description: 'Delete subscription from product' })
  public async unsubscribeFromProduct(
    @ParamModel(':productId', ProductSchemaName, true) product: ProductModel,
    @ParamModel(':businessId', BusinessSchemaName, true) business: BusinessModel,
  ): Promise<void> {

    return this.productSubscriptionsService.unsubscribeFromProduct(product, business);
  }
}
