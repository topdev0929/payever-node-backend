import { Module, forwardRef, OnModuleInit } from '@nestjs/common';
import { VariantsResolver } from './variants.resolver';
import { VariantsService } from './variants.service';
import { getModelToken, InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ProductBaseDocument } from '../new-products/documents/product-base.document';
import { VariantDocument } from './variant.document';
import { variantSchema } from './schemas/variant.schema';
import { NewProductsModule } from '../new-products/new-products.module';
import { mapImages } from '../new-products/product.service';
import { VariantInterface } from './interfaces/variant.interface';

@Module({
  exports: [VariantsService, getModelToken('Variant')],
  imports: [forwardRef(() => NewProductsModule)],
  providers: [
    VariantsResolver,
    VariantsService,
    {
      inject: ['ProductBase'],
      provide: getModelToken('Variant'),
      useFactory: (pbm: Model<ProductBaseDocument>): Model<VariantDocument> =>
        pbm.discriminator('NewVariant', variantSchema, 'Variant'),
    },
  ],
})
export class VariantsModule implements OnModuleInit {
  constructor(@InjectModel('Variant') private readonly variants: Model<VariantDocument>) { }

  public onModuleInit(): void {
    this.variants.schema.path('images').set(setMapImages);

    function setMapImages(this: VariantInterface, x: string[]): string[] {
      this.imagesUrl = mapImages(x);

      return x;
    }
  }
}
