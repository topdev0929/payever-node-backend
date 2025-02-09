import { Body, Controller, ForbiddenException, Param, Put, UseGuards } from '@nestjs/common';
import {
  AbstractController,
  Acl,
  AclActionsEnum,
  JwtAuthGuard,
  ParamModel,
  Roles,
  RolesEnum,
  User,
  UserTokenInterface,
} from '@pe/nest-kit';
import { ProductsElasticService, ProductService } from '../services';
import { CollectionSchemaName } from '../../categories/schemas';
import { CollectionModel } from '../../categories/models';
import { ProductIdListDto } from '../dto';
import { CollectionAssociateVoter } from '../voters';
import { CollectionsService } from '../../categories/services';

@Controller('/collections/:businessId/:collectionId/products')
@UseGuards(JwtAuthGuard)
@Roles(RolesEnum.merchant)
export class ProductsCollectionController extends AbstractController {
  constructor(
    private readonly productsService: ProductService,
    private readonly collectionsService: CollectionsService,
    private readonly productsElasticService: ProductsElasticService,
  ) {
    super();
  }

  @Put('/associate')
  @Acl({ microservice: 'products', action: AclActionsEnum.update })
  public async associateWithProducts(
    @ParamModel(':collectionId', CollectionSchemaName) collection: CollectionModel,
    @Body() dto: ProductIdListDto,
    @Param('businessId') businessId: string,
    @User() user: UserTokenInterface,
  ): Promise<void> {
    if (collection.businessId !== businessId) {
      throw new ForbiddenException('Collection doesn\'t belong to business');
    }
    await this.denyAccessUnlessGranted(CollectionAssociateVoter.ASSOCIATE, dto, user);
    if (collection.automaticFillConditions && collection.automaticFillConditions.filters.length > 0) {
      await this.collectionsService.addManualProducts(collection, dto.ids);
    }
    await this.productsService.associateProductsWithCollection(collection, dto.ids);
    await this.productsElasticService.indexProductsByIds(dto.ids);
  }
}
