import {
  Body, Controller, Delete, Get, Query, Param, Patch, Post, UseGuards, HttpCode, HttpStatus,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AbstractController, JwtAuthGuard, ParamModel, Roles, RolesEnum } from '@pe/nest-kit';
import { ProductDto, ProductQueryDto } from '../dto';
import { PopulatedVariantsCategoryCollectionsChannelSetProductModel, ProductModel } from '../models';
import { ProductSchemaName } from '../schemas';
import { ProductService, ProductTranslationService } from '../services';

const PRODUCT_ID: string = ':productId';

@Controller('admin/products')
@ApiTags('admin products')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
@Roles(RolesEnum.admin)
export class AdminProductsController extends AbstractController {
  constructor(
    private readonly productsService: ProductService,
    private readonly productTranslatorService: ProductTranslationService,
  ) {
    super();
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  public async getAll(
    @Query() query: ProductQueryDto,
  ): Promise<any> {
    return this.productsService.getForAdmin(query);
  }

  @Get(PRODUCT_ID)
  public async getById(
    @ParamModel(PRODUCT_ID, ProductSchemaName) product: ProductModel,
  ): Promise<ProductModel> {
    return product;
  }

  @Post()
  @HttpCode(HttpStatus.OK)
  public async create(
    @Body() dto: ProductDto,
  ): Promise<PopulatedVariantsCategoryCollectionsChannelSetProductModel> {
    return this.productsService.createFromDto(dto);
  }

  @Patch(PRODUCT_ID)
  @HttpCode(HttpStatus.OK)
  public async update(
    @ParamModel(PRODUCT_ID, ProductSchemaName, true) product: ProductModel,
    @Body() productDto: ProductDto,
  ): Promise<PopulatedVariantsCategoryCollectionsChannelSetProductModel> {
    return this.productsService.updateForAdmin(product.id, productDto);
  }

  @Patch(`business/:businessId/sku/:sku/`)
  @HttpCode(HttpStatus.OK)
  public async updateBySku(
    @Param('sku') sku: string,
    @Param('businessId') businessId: string,
    @Body() productDto: ProductDto,
  ): Promise<PopulatedVariantsCategoryCollectionsChannelSetProductModel> {
    return this.productsService.updateForAdminBySku(businessId, sku, productDto);
  }

  @Delete(PRODUCT_ID)
  @HttpCode(HttpStatus.OK)
  public async delete(
    @ParamModel(PRODUCT_ID, ProductSchemaName, true) product: ProductModel,
  ): Promise<void> {
    await this.productsService.removeProducts([product._id]);
  }
}
