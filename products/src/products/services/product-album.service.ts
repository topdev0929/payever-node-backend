import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { ProductModel } from '../models';
import { InjectModel } from '@nestjs/mongoose';
import { PaginationDto } from '../../common/dto';
import { PaginationHelper } from '../../common/helpers';
import { PaginationInterface } from '../../common/interfaces';
import { ProductsPaginatedInterface } from '../interfaces';

@Injectable()
export class ProductAlbumService {
  constructor(
    @InjectModel('Product') private readonly productModel: Model<ProductModel>,
  ) { }

  public async getProductByAlbum(
    albumId: string,
    businessId: string,
    pagination: PaginationDto,
  ): Promise<ProductsPaginatedInterface> {
    const page: PaginationInterface = PaginationHelper.getPagination(pagination);
    const sort: any = PaginationHelper.getSortQuery(pagination);

    const products: ProductModel[] = await this.productModel.find(
      {
        album: albumId,
        businessId: businessId,
      },
    ).sort(sort)
      .skip(page.skip).limit(page.limit);

    const count: number = await this.productModel.count(
      {
        album: albumId,
        businessId: businessId,
      },
    );

    return {
      info: {
        pagination: {
          item_count: count,
          page: Number(pagination.page),
          page_count: Math.ceil(count / Number(pagination.limit)),
          per_page: Number(pagination.limit),
        },
      },
      products: products,
    };
  }

  public async linkProductToAlbum(
    albumId: string,
    businessId: string,
    productId: string,
  ): Promise<ProductModel> {
    return this.productModel.findOneAndUpdate(
      {
        _id: productId,
        businessId: businessId,
      },
      {
        $set: {
          album: albumId,
        },
      },
      {
        new: true,
      },
    ).populate('album');
  }

  public async unlinkProductFromAlbum(
    businessId: string,
    productId: string,
  ): Promise<ProductModel> {
    return this.productModel.findOneAndUpdate(
      {
        _id: productId,
        businessId: businessId,
      },
      {
        $unset: {
          album: '',
        },
      },
      {
        new: true,
      },
    ).populate('album');
  }

  public async linkProductToAlbumForBuilder(
    business: string,
    filterString: string,
  ): Promise<any> {
    const filters: any[] = filterString !== '' ? JSON.parse(filterString) : [];
    for (const filter of filters) {
      await this.linkProductToAlbum(filter.album, business, filter.product);
    }
  }

  public async unlinkProductFromAlbumForBuilder(
    business: string,
    filterString: string,
  ): Promise<any> {
    const filters: any[] = filterString !== '' ? JSON.parse(filterString) : [];
    for (const filter of filters) {
      await this.unlinkProductFromAlbum(business, filter.product);
    }
  }
}
