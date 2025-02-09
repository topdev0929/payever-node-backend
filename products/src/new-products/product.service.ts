import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { ProductDocument } from './documents/product.document';
import { ProductInterface } from './interfaces/product.interface';
import { environment } from '../environments';
import { PaginationDto, SortDto } from '../products/dto';
import { ProductsPaginatedInterface } from '../products/interfaces';
import { VariantDocument } from '../variants/variant.document';
import { SaleHelper } from '../common/helpers';

@Injectable()
export class ProductService {
  constructor(
    @InjectModel('NewProduct') private readonly products: Model<ProductDocument>,
    @InjectModel('Variant') private readonly variants: Model<VariantDocument>,
  ) { }

  public async get(id: string): Promise<ProductInterface> {
    const product: ProductDocument = await this.products.findById(id).populate('collections').populate('channelSets');

    if (!product) {
      return null;
    }

    let result: any = product.toObject();

    let i: number = 0;
    for (const channelSet of result.channelSets) {
      result.channelSets[i].id = result.channelSets[i]._id;
      i++;
    }

    result = SaleHelper.saleDateFormat(result);

    return result;
  }

  public async getMany(ids: string[]): Promise<ProductInterface[]> {
    const docs: ProductDocument[] = await this.products.find({ _id: { $in: ids } }).populate('collections');

    return docs.map((x: ProductDocument) => x.toObject() as ProductInterface);
  }

  /* tslint:disable:cognitive-complexity */
  public async getProductsPaginated(
    businessId: string,
    query: object,
    pagination: PaginationDto = { page: 1, limit: 0 },
    sort: SortDto[],
  ): Promise<ProductsPaginatedInterface> {
    const { page, limit }: { page: number; limit: number } = pagination;
    let skip: number = (page - 1) * limit;

    if (pagination.offset !== undefined && pagination.offset >= 0) {
      skip = pagination.offset;
    }

    const orderBy: { [propName: string]: 1 | -1 } = { };
    for (const subSort of sort) {
      orderBy[subSort.field ? subSort.field : 'createdAt'] = subSort.direction === 'asc' ? 1 : -1;
    }

    const productFacet: any[] = [];
    if (Object.keys(orderBy).length > 0) {
      productFacet.push({
        $sort: orderBy,
      });
    }
    productFacet.push({
      $skip: skip,
    });
    productFacet.push({
      $limit: limit,
    });

    let productsPaginated: any = await this.products
      .aggregate([
        { $match: businessId ? { businessId } : { }},
        {
          $lookup: {
            as: 'populatedCollections',
            foreignField: '_id',
            from: 'collections',
            localField: 'collections',
          },
        },
        { $lookup: { from: 'products', localField: '_id', foreignField: 'product', as: 'variants' } },
        { $lookup:
          {
            as: 'channelSets',
            foreignField: '_id',
            from: 'channelsets',
            localField: 'channelSets',
          },
        },
        {
          $project: {
            apps: 1, active: 1, collections: 1, channelSets: 1, imagesUrl: 1, images: 1, dropshipping: 1,
            example: 1, videosUrl: 1, videos: 1, onSales: 1, isLocked: 1, __t: 1, attributes: 1, barcode: 1,
            brand: 1, condition: 1, businessId: 1, company: 1, country: 1, categories: 1,
            currency: 1, deliveries: 1, description: 1, language: 1, options: 1, price: 1, priceTable: 1,
            sale: 1, shipping: 1, sku: 1, title: 1, type: 1, variantAttributes: 1, vatRate: 1,
            origin: 1, createdAt: 1, updatedAt: 1, slug: 1, variants: 1, populatedCollections: 1, __v: 1,
            channelSetCategories: {
              $reduce: {
                input: '$channelSetCategories.categories',
                initialValue: [],
                in: {
                  $concatArrays: [
                    '$$value',
                    '$$this',
                  ],
                },
              },
            },
          },
        },
        { $match: query },
        {
          $facet: {
            pageInfo: [
              {
                $group: {
                  _id: null,
                  count: { $sum: 1 },
                },
              },
            ],
            products: productFacet,
          },
        },
      ])
      .exec();
    productsPaginated = productsPaginated.pop();
    productsPaginated.pageInfo = productsPaginated.pageInfo.pop();
    const itemCount: number = productsPaginated.pageInfo ? productsPaginated.pageInfo.count : 0;
    const pageCount: number = productsPaginated.pageInfo ? Math.ceil(itemCount / limit) : 0;

    let products: any;
    if (Array.isArray(productsPaginated.products)) {
      products = productsPaginated.products.map((p: any) => {

        const prodObj: any = new this.products(p).toObject();

        prodObj.salePercent = p.salePercent;
        prodObj.saleStartDate = p.saleStartDate;
        prodObj.saleEndDate = p.saleEndDate;
        prodObj.sale = p.sale;

        if (p.album) {
          prodObj.album = p.album;
        }
        if (Array.isArray(p.variants)) {
          prodObj.variants = p.variants.map((v: any) => new this.variants(v).toObject());
        }

        if (Array.isArray(p.channelSets)) {
          prodObj.channelSets = p.channelSets.map((v: any) => {
            return {
              id: v._id,
              name: v.name,
              type: v.type,
            };
          });
        }

        if (p.populatedCollections) {
          prodObj.collections = p.populatedCollections;
        }

        return prodObj;
      });
    }

    return {
      info: {
        pagination: {
          item_count: itemCount,
          page,
          page_count: pageCount,
          per_page: limit,
        },
      },
      products,
    };
  }

  public async getProductsByBusiness(businessId: string): Promise<ProductInterface[]> {
    const docs: ProductDocument[] = await this.products.find({ businessId }).populate('collections');

    return docs.map((x: ProductDocument) => x.toObject() as ProductInterface);
  }
}

export function mapImages(images: string[]): string[] {
  return (images || []).map((name: string) => `${environment.storage}/products/${name}`);
}
