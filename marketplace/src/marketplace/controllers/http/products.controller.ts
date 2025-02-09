import { Body, Controller, Delete, Get, Patch, Post, UseGuards } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { ProductModel } from '../../interfaces';
import { CreateProductDto, GetProductsListQueryDto, PaginatedProductListDto, UpdateProductDto } from '../../dto';
import {
  AbstractController,
  AccessTokenPayload,
  Acl,
  AclActionsEnum,
  JwtAuthGuard,
  ParamModel,
  QueryDto,
  Roles,
  RolesEnum,
  User,
} from '@pe/nest-kit';
import { ProductsService } from '../../services';
import { BusinessSchemaName, ProductSchemaName } from '../../schemas';
import { ProductDeleteVoter, ProductUpdateVoter } from '../../voters';
import { BusinessModel } from '../../interfaces/entities';

@Controller('/business/:businessId/products')
@ApiTags('products')
@UseGuards(JwtAuthGuard)
@Roles(RolesEnum.merchant)
export class ProductsController extends AbstractController {

  constructor(
    private readonly productsService: ProductsService,
  ) {
    super();
  }

  @Post()
  @Acl({ microservice: 'marketplace', action: AclActionsEnum.create })
  @ApiOperation({ summary: 'addProduct', description: 'Add product' })
  public async addProduct(
    @Body() dto: CreateProductDto,
    @ParamModel(':businessId', BusinessSchemaName, true) business: BusinessModel,
  ): Promise<ProductModel> {
    return this.productsService.create(dto, business);
  }

  @Patch('/:productId')
  @Acl({ microservice: 'marketplace', action: AclActionsEnum.update })
  @ApiOperation({ summary: 'updateProduct', description: 'Update product' })
  public async updateProduct(
    @User() user: AccessTokenPayload,
    @Body() dto: UpdateProductDto,
    @ParamModel(':productId', ProductSchemaName, true) product: ProductModel,
  ): Promise<ProductModel> {
    await this.denyAccessUnlessGranted(ProductUpdateVoter.UPDATE, product, user);

    return this.productsService.update(product, dto);
  }

  @Delete('/:productId')
  @Acl({ microservice: 'marketplace', action: AclActionsEnum.delete })
  @ApiOperation({ summary: 'deleteProduct', description: 'Delete product' })
  public async deleteProduct(
    @User() user: AccessTokenPayload,
    @ParamModel(':productId', ProductSchemaName, true) product: ProductModel,
  ): Promise<void> {
    await this.denyAccessUnlessGranted(ProductDeleteVoter.DELETE, product, user);

    return this.productsService.delete(product);
  }

  @Get()
  @Acl({ microservice: 'marketplace', action: AclActionsEnum.read })
  @ApiOperation({ summary: 'getProductsList', description: 'Get products list' })
  public async getProductsList(
    @QueryDto() query: GetProductsListQueryDto,
  ): Promise<PaginatedProductListDto> {
    return this.productsService.getPaginatedList(query);
  }
}
