import { 
  Body, 
  Controller, 
  Delete, 
  Get, 
  Query, 
  Param, 
  Patch, 
  Post, 
  UseGuards, 
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

import { 
  AbstractController, 
  AccessTokenPayload, 
  JwtAuthGuard, 
  ParamModel, 
  Roles, 
  RolesEnum, 
  User,
} from '@pe/nest-kit';
import { PaginationDto, ProductDto } from '../dto';
import { ProductFilterDto } from '../dto/rest';
import { ProductsPaginatedInterface } from '../interfaces';
import { PopulatedVariantsCategoryCollectionsChannelSetProductModel, ProductModel } from '../models';
import { ProductSchemaName } from '../schemas';
import { ProductService } from '../services';
import { ProductCreateVoter, ProductDeleteVoter, ProductUpdateVoter } from '../voters';

const PRODUCT_ID: string = ':productId';

@Controller('business/:businessId/products')
@ApiTags('products')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
@Roles(RolesEnum.anonymous)
export class ProductsController extends AbstractController {
  constructor(
    private readonly productsService: ProductService,
  ) {
    super();
  }

  @Get()
  public async getProducts(
    @User() user: AccessTokenPayload,
    @Param('businessId') businessId: string,
    @Query() dto: ProductFilterDto,
  ): Promise<ProductsPaginatedInterface> {
    const pagination: PaginationDto = {
      limit: dto.limit,
      page: dto.page,
    };

    return this.productsService.getProducts(businessId, dto.sortBy, pagination, dto);
  }

  @Post()
  public async createProduct(
    @User() user: AccessTokenPayload,
    @Body() dto: ProductDto,
  ): Promise<PopulatedVariantsCategoryCollectionsChannelSetProductModel> {
    if (!dto.businessId) {
      dto.businessId = dto.businessUuid;
    }

    await this.denyAccessUnlessGranted(ProductCreateVoter.CREATE, dto, user);

    return this.productsService.createFromDto(dto);
  }

  @Get(PRODUCT_ID)
  public async getProduct(
    @Param('businessId') businessId: string,
    @Param('productId') productId: string,
  ): Promise<ProductModel> {
    return this.productsService.getProductByBusinessAndId(businessId, productId);
  }

  @Patch(PRODUCT_ID)
  public async updateProduct(
    @User() user: AccessTokenPayload,
    @ParamModel(PRODUCT_ID, ProductSchemaName, true) product: ProductModel,
    @Body() dto: ProductDto,
  ): Promise<PopulatedVariantsCategoryCollectionsChannelSetProductModel> {
    if (!dto.businessId) {
      dto.businessId = dto.businessUuid;
    }
    if (!dto.id) {
      dto.id = product.id;
    }
    await this.denyAccessUnlessGranted(ProductUpdateVoter.UPDATE, dto, user);

    return this.productsService.updateFromDto(dto);
  }

  @Delete(PRODUCT_ID)
  public async removeProduct(
    @User() user: AccessTokenPayload,
    @ParamModel(PRODUCT_ID, ProductSchemaName, true) product: ProductModel,
  ): Promise<number> {
    await this.denyAccessUnlessGranted(ProductDeleteVoter.DELETE, [product._id], user);

    return this.productsService.removeProducts([product._id]);
  }
}
