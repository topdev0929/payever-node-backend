import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { ProductDto } from '../dto';
import { ProductModel } from '../models';
import { Model } from 'mongoose';
import { ProductSchemaName } from '../schemas';
import { BusinessModel } from '@pe/business-kit';

@Injectable()
export class ProductsService {
  constructor(
    @InjectModel(ProductSchemaName) private readonly productModel: Model<ProductModel>,
  ) { }

  public async getByBusiness(business: BusinessModel)
  : Promise<ProductModel[]> {
    return this.productModel.find({ business: business._id });
  }

  public async getById(productId: string)
  : Promise<ProductModel> {
    return this.productModel.findOne({ _id: productId });
  }

  public async findOrCreate(business: BusinessModel, createProductDto: ProductDto)
  : Promise<ProductModel> {
    const product: ProductModel = await this.productModel.findOne({ _id: createProductDto._id });

    if (!!product) {
      return product;
    }

    return this.productModel.create({
      ...createProductDto,
      business: business._id,
    });
  }

  public async update(product: ProductModel, createProductDto: ProductDto)
  : Promise<ProductModel> {
    return this.productModel.findByIdAndUpdate(
      product._id,
      {
        $set: {
          ...createProductDto,
        },
      },      
    );
  }

  public async delete(product: ProductModel): Promise<void> {
    await product.remove();
  }
}
