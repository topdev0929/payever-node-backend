import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';

import {
  SampleProductQueryDto,
  CreateSampleProductDto,
  UpdateSampleProductDto,
} from '../dto';
import { SampleProductsModel } from '../models';
import { SampleProductInterface } from '../interfaces';
import { SampleProductSchemaName } from '../schemas';

@Injectable()
export class SampleProductsService {
  private static readonly MAX_RANDOM: number = 10;

  constructor(
    @InjectModel(SampleProductSchemaName) private readonly sampleProductsModel: Model<SampleProductsModel>,
  ) { }

  public async getSampleProducts(industry: string, businessProduct: string): Promise<SampleProductInterface[]> {
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

    return sampleByIndustry.map((product: SampleProductsModel) => product.toObject());
  }

  public async getSampleRandomProducts(businessProduct: string): Promise<SampleProductInterface[]> {
    const sampleByBusinessProduct: SampleProductsModel[] = await this.sampleProductsModel.find({
      product: businessProduct,
    });
    if (!sampleByBusinessProduct.length) {
      return [];
    }

    if (sampleByBusinessProduct.length <= SampleProductsService.MAX_RANDOM) {
      return sampleByBusinessProduct.map((product: SampleProductsModel) => product.toObject());
    }

    const sampleProductRandom: SampleProductInterface[] = [];
    for (let index: number = 0; index <= SampleProductsService.MAX_RANDOM; index++) {
      const randomNumber: number = Math.floor(Math.random() * sampleByBusinessProduct.length);
      const sample: SampleProductsModel = sampleByBusinessProduct[randomNumber];
      sampleByBusinessProduct.splice(randomNumber, 1);

      sampleProductRandom.push(sample);
    }

    return sampleProductRandom.map((product: SampleProductsModel) => product.toObject());
  }

  public async getForAdmin(query: SampleProductQueryDto): Promise<any> {
    const limit: number = query.limit || 100;
    const page: number = query.page || 1;
    const offset: number = (page - 1) * limit;

    const conditions: any = { };

    if (query.businessIds) {
      conditions.businessId = { $in: query.businessIds };
    }

    if (query.searchString) {
      conditions.$text = { $search: query.searchString };
    }

    const documents: SampleProductsModel[] = await this.sampleProductsModel
      .find(conditions)
      .select(query.projection)
      .sort({ createdAt: 1 })
      .skip(offset)
      .limit(limit);

    const total: number = await this.sampleProductsModel.count({ });

    return {
      documents,
      page,
      total,
    };
  }

  public async create(dto: CreateSampleProductDto): Promise<SampleProductsModel> {
    return this.sampleProductsModel.create(dto);
  }

  public async update(sampleProducts: SampleProductsModel, dto: UpdateSampleProductDto): Promise<SampleProductsModel> {
    return this.sampleProductsModel.findOneAndUpdate(
      {
        _id: sampleProducts._id,
      },
      {
        $set: dto,
      },
      {
        new: true,
      },
    );
  }

  public async remove(sampleProduct: SampleProductsModel): Promise<SampleProductsModel> {
    return this.sampleProductsModel.findOneAndDelete({ _id: sampleProduct._id });
  }
}
