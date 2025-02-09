import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { SampleProductsModel } from '../models';
import { SampleProductInterface } from '../interfaces';
import { SampleProductSchemaName } from '../schemas';

@Injectable()
export class SampleProductsService {
  private static readonly MAX_RANDOM: number = 10;
  constructor(
    @InjectModel(SampleProductSchemaName) private readonly sampleProductsModel: Model<SampleProductsModel>,
  ) { }

  public async getSampleProducts(industry: string, businessProduct: string): Promise<SampleProductsModel[]> {
    const sampleByIndustry: SampleProductsModel[] = await this.sampleProductsModel.find({
      industry: industry,
      product: businessProduct,
    });

    if (!sampleByIndustry.length) {
      if (industry !== 'BRANCHE_OTHER') {
        return [];
      }

      return this.getSampleRandomProducts(businessProduct);
    }

    return sampleByIndustry.map((product: SampleProductsModel) => product.toObject()) as SampleProductsModel[];
  }

  private async getSampleRandomProducts(businessProduct: string): Promise<SampleProductsModel[]> {
    const sampleByBusinessProduct: SampleProductsModel[]
      = await this.sampleProductsModel.find({ product: businessProduct });
    if (!sampleByBusinessProduct.length) {
      return [];
    }

    if (sampleByBusinessProduct.length <= SampleProductsService.MAX_RANDOM) {
      return sampleByBusinessProduct.map((product: SampleProductsModel) => product.toObject()) as SampleProductsModel[];
    }

    const sampleProductRandom: SampleProductsModel[] = [];
    for (let index: number = 0; index <= SampleProductsService.MAX_RANDOM; index++) {
      const randomNumber: number = Math.floor(Math.random() * sampleByBusinessProduct.length);
      const sample: SampleProductsModel = sampleByBusinessProduct[randomNumber];
      sampleByBusinessProduct.splice(randomNumber, 1);

      sampleProductRandom.push(sample);
    }

    return sampleProductRandom.map((product: SampleProductsModel) => product.toObject()) as SampleProductsModel[];
  }
}
