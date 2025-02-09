import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { EventDispatcher } from '@pe/nest-kit';
import { Model } from 'mongoose';
import { ProductExportedDto, SubscriptionProductDto } from '../dto';
import { ProductSchemaName } from '../schemas';
import { BusinessModel } from '../../business';
import { ProductModel } from '../models';
import { ProductEventsEnum } from '../enums';
import { ProductsEventsProducer } from '../producers';

@Injectable()
export class Products {
  constructor(
    @InjectModel(ProductSchemaName) private readonly productsModel: Model<ProductModel>,
    private readonly eventDispatcher: EventDispatcher,
    private readonly productsEventsProducer: ProductsEventsProducer,
  ) {
  }

  public async createProduct(dto: SubscriptionProductDto, business: BusinessModel): Promise<ProductModel> {
    const existingProduct: ProductModel = await this.productsModel.findById(dto._id);
    if (existingProduct) {
      this.productsEventsProducer.syncProduct(dto._id).catch();

      return this.updateProduct(dto);
    }

    const product: ProductModel = await this.productsModel.create({
      _id: dto._id,
      businessId: business.id,
      image: dto.image,
      price: dto.price,
      title: dto.title,
    });
    await this.eventDispatcher.dispatch(ProductEventsEnum.ProductCreated, product);
    this.productsEventsProducer.syncProduct(dto._id).catch();

    return product;
  }

  public async upsertByExport(dto: ProductExportedDto): Promise<void> {
    const set: any = {
      ...dto,
    };
    set.image = dto.imagesUrl[0] || dto.images[0] || dto.image;
    delete set._id;

    await this.productsModel.findOneAndUpdate(
      {
        _id: dto._id,
      },
      {
        $set: set,
      },
      {
        setDefaultsOnInsert: true,
        upsert: true,
      },
    );
  }

  public async updateProduct(dto: SubscriptionProductDto): Promise<ProductModel> {
    const existingProduct: ProductModel = await this.productsModel.findById(dto._id);
    const updatedProduct: ProductModel = await this.productsModel.findOneAndUpdate(
      { _id: dto._id },
      { $set: dto },
      { upsert: true, new: true },
    );
    await this.eventDispatcher.dispatch(ProductEventsEnum.ProductUpdated, existingProduct, updatedProduct);

    return updatedProduct;
  }

  public async removeProduct(product: ProductModel): Promise<void> {
    await this.productsModel.findByIdAndDelete(product.id);
  }

  public async getListForBusiness(business: BusinessModel): Promise<ProductModel[]> {
    return this.productsModel.find({
      businessId: business.id,
    });
  }

  public async getListForIds(productIds: string[]): Promise<ProductModel[]> {
    return this.productsModel.find({
      _id: {
        $in: productIds,
      },
    });
  }

  public async getById(id: string): Promise<ProductModel> {
    return this.productsModel.findById(id);
  }
}
