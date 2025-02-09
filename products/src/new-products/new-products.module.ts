import { Module, OnModuleInit } from '@nestjs/common';
import { ProductResolver } from './product.resolver';
import { getModelToken, InjectModel, MongooseModule } from '@nestjs/mongoose';
import { mapImages, ProductService } from './product.service';
import { productBaseSchema } from './schemas/product-base.schema';
import { Model } from 'mongoose';
import { ProductBaseDocument } from './documents/product-base.document';
import { productSchema } from './schemas/product.schema';
import { ProductDocument } from './documents/product.document';
import { ChannelSetsModule } from '../channel-sets/channel-sets.module';
import { CategoriesModule } from '../categories/categories.module';
import { ShippingModule } from '../shipping/shipping.module';
import { VariantsModule } from '../variants/variants.module';
import { ProductInterface } from './interfaces/product.interface';

@Module({
  exports: ['ProductBase', 'NewProductService'],
  imports: [
    MongooseModule.forFeature([{ name: 'ProductBase', schema: productBaseSchema, collection: 'products' }]),
    CategoriesModule,
    ChannelSetsModule,
    ShippingModule,
    VariantsModule,
  ],
  providers: [
    ProductResolver,
    ProductService,
    {
      provide: 'ProductBase',
      useExisting: getModelToken('ProductBase'),
    },
    {
      provide: 'NewProductService',
      useExisting: ProductService,
    },
    {
      inject: [getModelToken('ProductBase')],
      provide: getModelToken('NewProduct'),
      useFactory: (pbm: Model<ProductBaseDocument>): Model<ProductDocument> =>
        pbm.discriminator('NewProduct', productSchema, 'Product'),
    },
  ],
})
export class NewProductsModule implements OnModuleInit {
  constructor(@InjectModel('NewProduct') private readonly products: Model<ProductDocument>) { }

  public onModuleInit(): void {
    this.products.schema.path('images').set(setMapImages);
    this.products.schema.path('videos').set(setMapVideos);

    function setMapImages(this: ProductInterface, x: string[]): string[] {
      this.imagesUrl = mapImages(x);

      return x;
    }
    function setMapVideos(this: ProductInterface, x: string[]): string[] {
      this.videosUrl = mapImages(x);

      return x;
    }
  }
}
