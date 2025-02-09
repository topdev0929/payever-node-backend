import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { PopulatedVariantsCategoryCollectionsChannelSetProductModel, ProductModel, ProductTranslationModel } from '../models';
import { ProductTranslationMapperHelper } from '../helpers';
import { TranslationInterface } from '../interfaces';
import { ProductVariantModel } from '../models/product-variant.model';
import { ProductVariantsService } from './product-variants.service';

@Injectable()
export class ProductTranslationService {
  constructor(
    @InjectModel('ProductTranslation') private readonly productTranslationModel: Model<ProductTranslationModel>,
    private readonly productVariantsService: ProductVariantsService,
  ) { }

  public async upsertTranslation(
    product: ProductModel | PopulatedVariantsCategoryCollectionsChannelSetProductModel,
  ): Promise<void> {
    const existingProductTranslation: ProductTranslationModel = await this.productTranslationModel.findOne(
      {
        product: product._id,
      },
    );

    const productTranslation: any = {
      product: product._id,
    };

    if (existingProductTranslation) {
      productTranslation.translations = existingProductTranslation.translations;
      productTranslation.translations[product.language] = ProductTranslationMapperHelper.toTranslation(product);
    } else {
      productTranslation.translations = {
        [product.language] : ProductTranslationMapperHelper.toTranslation(product),
      };
    }

    await this.productTranslationModel.findOneAndUpdate(
      {
        product: product._id,
      },
      {
        $set: productTranslation,
      },
      {
        setDefaultsOnInsert: true,
        upsert: true,
      },
    );
  }

  public async removeTranslation(productId: string): Promise<void> {
    await this.productTranslationModel.remove(
      {
        product: productId,
      },
    );
  }

  public async getProductTranslation(productId: string, language: string): Promise<any> {
    const productTranslation: ProductTranslationModel = await this.productTranslationModel.findOne(
      {
        product: productId,
      },
    );

    if (!productTranslation) {
      return ;
    }

    const translationLanguage: TranslationInterface = productTranslation.translations[language];

    if (!translationLanguage) {
      return ;
    }

    if (translationLanguage?.variants?.length > 0) {
      const variants: ProductVariantModel[]
        = await this.productVariantsService.getVariantByIds(translationLanguage.variants as any);
      translationLanguage.variants = variants as any;
    }

    return translationLanguage;
  }
}
