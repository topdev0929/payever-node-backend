import { Injectable, Logger } from '@nestjs/common';
import { ProductService } from './product.service';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { PopulatedVariantsCategoryCollectionsChannelSetProductModel, ProductModel } from '../models';
import { FORCE_POPULATION_TYPE } from '../../special-types';
import { ProductsEventsProducer } from '../producers';
import { ProductSaleInterface } from '../interfaces';

@Injectable()
export class CommandService {
  constructor(
    @InjectModel('Product') private readonly productModel: Model<ProductModel>,
    private readonly productService: ProductService,
    private readonly productsEventsProducer: ProductsEventsProducer,
    private readonly logger: Logger,
  ) { }

  public async populateAllSlug(): Promise<void> {
    const products: ProductModel[] = await this.productModel
      .find({ slug: { $exists : false }})
      .sort({ createdAt: 1 })
      .limit(10000);

    for (const product of products) {
      await product.populate('variants')
        .populate('category')
        .populate('collections')
        .populate('channelSets')
        .execPopulate();

      const updatedProduct: PopulatedVariantsCategoryCollectionsChannelSetProductModel
        = await this.productService.populateSlug(product as FORCE_POPULATION_TYPE);

      this.logger.log(`${updatedProduct._id} ${updatedProduct.slug}`);

      await this.productsEventsProducer.slugPopulated(updatedProduct);
    }
  }

  public async migrateSale(): Promise<void> {
    const products: any[] = await this.productModel
      .find(
        {
          $or : [
            { onSales: true },
            { salePrice: { $ne: null } },
          ],
          sale: { $exists: false },
        },
      )
      .sort({ createdAt: 1 })
      .limit(100);


    if (products.length > 0) {
      for (const product of products) {
        const sale: ProductSaleInterface = {
          onSales: product.onSales,
          saleEndDate: product.saleEndDate,
          salePercent: product.salePercent,
          salePrice: product.salePrice,
          saleStartDate: product.saleStartDate,
        };

        await this.productModel.findOneAndUpdate(
          {
            _id: product._id,
          },
          {
            $set : {
              sale: sale,
            },
          },
        );
      }

      await this.migrateSale();
    }
  }
}
