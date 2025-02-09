import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import * as dateFns from 'date-fns';
import { Model } from 'mongoose';
import { BusinessService } from '@pe/business-kit';

import { BusinessModel } from '../../../business/models';
import { MongooseModel } from '../enums';
import { BusinessLastSoldProductsListModel, BusinessProductAggregateModel, ProductModel } from '../models';

@Injectable()
export class BusinessProductsAppService {

  constructor(
    private readonly logger: Logger,
    private readonly businessService: BusinessService,
    @InjectModel(MongooseModel.BusinessProductAggregate)
      private readonly productModel: Model<BusinessProductAggregateModel>,
    @InjectModel(MongooseModel.BusinessLastSoldProductsList)
      private readonly lastSoldProductsList: Model<BusinessLastSoldProductsListModel>,
  ) { }

  public async getPopularLastWeek(business: BusinessModel): Promise<ProductModel[]> {
    const today: Date = new Date();
    const weekAgo: Date = dateFns.addDays(today, -7);

    return this.productModel.find(
      {
        businessId: business.id,
        lastSell: {
          $gte : weekAgo,
        },
        uuid: {
          $ne: '',
        },
      },
      [],
      {
        limit: 10,
        sort: {
          lastSell: -1,
          quantity: -1,
        },
      },
    );
  }

  public async getPopularLastMonth(business: BusinessModel): Promise<ProductModel[]> {
    const today: Date = new Date();
    const monthAgo: Date = dateFns.addMonths(today, -1);

    return this.productModel.find(
      {
        businessId: business.id,
        lastSell: {
          $gte : monthAgo,
        },
        uuid: {
          $ne: '',
        },
      },
      [],
      {
        limit: 10,
        sort: {
          lastSell: -1,
          quantity: -1,
        },
      },
    );
  }

  public async getLastSold(business: BusinessModel): Promise<ProductModel[]> {
    const list: BusinessLastSoldProductsListModel = await this.lastSoldProductsList.findById(business.id).exec();

    return list ? list.products : [];
  }

  public async getPopularTotal(business: BusinessModel): Promise<ProductModel[]> {
    return this.productModel.find(
      {
        businessId: business.id,
        uuid: {
          $ne: '',
        },
      },
      [],
      {
        limit: 10,
        sort: {
          lastSell: -1,
          quantity: -1,
        },
      },
    );
  }
}
