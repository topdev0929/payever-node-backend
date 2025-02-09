import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { ProductSchemaName } from '../schemas';
import { Model } from 'mongoose';
import { BusinessModel, ProductModel } from '../interfaces/entities';
import { CreateProductDto, GetProductsListQueryDto, PaginatedProductListDto, UpdateProductDto } from '../dto';
import { ProductConverter } from '../converters';
import { MarketplaceChannelSetsService } from './marketplace-channel-sets.service';
import { ChannelSetModel } from '@pe/channels-sdk';
import { EventDispatcher } from '@pe/nest-kit';
import { ProductEventEnum } from '../enums';

@Injectable()
export class ProductsService {
  constructor(
    @InjectModel(ProductSchemaName) private readonly productModel: Model<ProductModel>,
    private readonly marketplaceChannelSetsService: MarketplaceChannelSetsService,
    private readonly eventDispatcher: EventDispatcher,
  ) { }

  public async getPaginatedList(query: GetProductsListQueryDto): Promise<PaginatedProductListDto> {
    let page: number = query.page || 1;
    page = page < 0 ? 1 : page;

    const perPage: number = query.perPage || 50;

    const total: number = await this.productModel.countDocuments();
    const list: ProductModel[] = await this.productModel
      .find({ })
      .limit(perPage)
      .skip((page - 1) * perPage)
      .populate('business')
      .populate('channelSet');

    return {
      list: list.map((product: ProductModel) => ProductConverter.toProductDto(product)),
      page,
      perPage,
      total,
    };
  }

  public async create(dto: CreateProductDto, business: BusinessModel): Promise<ProductModel> {
    const channelSet: ChannelSetModel = await this.marketplaceChannelSetsService.findOrCreate(business);


    const created: ProductModel = await this.productModel.create(
      {
        _id:  dto.id,
        businessId: business.id,
        channelSet: channelSet.id,
        country: dto.country,
        currency: dto.currency,
        price: dto.price,
        title: dto.title,
        type: dto.type,
      } as ProductModel,
    );

    await this.eventDispatcher.dispatch(ProductEventEnum.ProductCreated, created);

    return created;
  }

  public async update(product: ProductModel, dto: UpdateProductDto): Promise<ProductModel> {
    const updatedProduct: ProductModel =  await this.productModel.findOneAndUpdate(
      { _id:  product.id },
      {
        $set: {
          country: dto.country,
          currency: dto.currency,
          price: dto.price,
          title: dto.title,
          type: dto.type,
        },
      },
      {
        new: true,
        upsert: true,
      },
    );

    await this.eventDispatcher.dispatch(ProductEventEnum.ProductUpdated, updatedProduct);

    return updatedProduct;
  }

  public async delete(product: ProductModel): Promise<void> {
    const removedProduct: ProductModel = await this.productModel.findOneAndDelete({ _id: product.id});
    await this.eventDispatcher.dispatch(ProductEventEnum.ProductRemoved, removedProduct);
  }

  public async increaseImports(marketplaceProduct: ProductModel): Promise<ProductModel> {
    if (!marketplaceProduct.imports) {
      marketplaceProduct.imports = 0;
    }
    marketplaceProduct.imports++;
    await marketplaceProduct.save();

    return marketplaceProduct;
  }

  public async getById(id: string): Promise<ProductModel> {
    return this.productModel.findOne({
      _id: id,
    });
  }
}
