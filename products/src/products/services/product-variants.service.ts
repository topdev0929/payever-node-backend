import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { ProductModel } from '../models';
import { Model, ClientSession, Types } from 'mongoose';
import { PopulatedProductVariantModel1, ProductVariantModel } from '../models/product-variant.model';
import { environment } from '../../environments/environment';
import { FIX_MISTYPING, FORCE_POPULATION_TYPE } from 'src/special-types';

@Injectable()
export class ProductVariantsService {
  constructor(
    @InjectModel('ProductVariant') private readonly variantModel: Model<ProductVariantModel>,
    @InjectModel('Product') private readonly productModel: Model<ProductModel>,
  ) { }

  public async createVariant(productId: string, data: Partial<ProductVariantModel>): Promise<ProductVariantModel> {
    let newVariant: ProductVariantModel;
    const session: ClientSession = await this.productModel.db.startSession();
    await session.withTransaction(
      async (): Promise<void> => {
        const product: ProductModel = await this.productModel.findById(productId).session(session);
        if (product) {
          newVariant = (await this.variantModel.create(
            [{ ...data, businessId: product.businessId, product: productId }] as ProductVariantModel[],
            { session },
          ))[0];
          product.variants.push(newVariant._id);
          await product.save();
        }
      },
    );

    return newVariant;
  }

  public async updateVariant(id: string, variantInput: Partial<ProductVariantModel>): Promise<ProductVariantModel> {
    const variant: ProductVariantModel = await this.variantModel.findById(id);
    if (variant) {

      if (variant.isLocked) {
        throw new Error(`Variant is locked`);
      }

      Object.assign(variant, variantInput);
      await variant.save();
    }

    return variant;
  }

  public async deleteVariant(id: string): Promise<PopulatedProductVariantModel1> {
    let variant: PopulatedProductVariantModel1;
    const session: ClientSession = await this.variantModel.db.startSession();
    await session.withTransaction(async () => {
      variant = (await this.variantModel
        .findById(id)
        .session(session)
        .populate('product')) as FORCE_POPULATION_TYPE;
      if (variant) {
        const product: ProductModel = variant.product;
        if (product) {
          (product.variants as FIX_MISTYPING).pull(variant.id);
          await product.save();
        }
        await variant.deleteOne();
      }
    });

    return variant;
  }

  public async getVariant(id: string): Promise<ProductVariantModel> {
    return this.variantModel.findById(id);
  }

  public async getVariantByIds(ids: string[]): Promise<ProductVariantModel[]> {
    return this.variantModel.find(
      {
        _id: { $in: ids },
      },
    );
  }

  public resolveImages(urls: string[]): string[] {
    return (urls || []).map((x: string) => `${environment.storage}/products/${x}`);
  }

  public async duplicateVariants(ids: string[], productId: string): Promise<void> {
    if (ids?.length) {
      const originalVariants: ProductVariantModel[] = await this.getVariantByIds(ids);
      const variantCreationPromises: Array<Promise<void>> = originalVariants
        .map(async (variant: ProductVariantModel) => {
          const copiedVariantObj: any = variant.toObject();
          const { 
            _id,
            id,
            createdAt,
            updatedAt,
            ...copiedVariantDto
          }: Record<string, any> = copiedVariantObj;
      
          await this.createVariant(productId, copiedVariantDto);
        });
    
      await Promise.all(variantCreationPromises);
    }
  }
}
