import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import * as dateFns from 'date-fns';
import { Model } from 'mongoose';
import { ChannelSetModel } from '../../../statistics/models';
import { ChannelSetService } from '../../../statistics/services/channel-set.service';
import { DateRevenueInterface } from '../../transactions-app/interfaces';
import { ChannelSetTransactionsService } from '../../transactions-app/services';
import { MongooseModel } from '../enums';
import { ChannelSetLastSoldProductsListModel, ChannelSetProductAggregateModel, ProductModel } from '../models';
import { BusinessModel } from '../../../business';

@Injectable()
export class ChannelSetProductsAppService {

  constructor(
    private readonly channelSetService: ChannelSetService,
    private readonly channelSetTransactionsService: ChannelSetTransactionsService,
    @InjectModel(MongooseModel.ChannelSetProductAggregate)
      private readonly productModel: Model<ChannelSetProductAggregateModel>,
    @InjectModel(MongooseModel.ChannelSetLastSoldProductsList)
      private readonly lastSoldProductsList: Model<ChannelSetLastSoldProductsListModel>,
    private readonly logger: Logger,
  ) { }

  public async getWeekRevenuesAmount(business: BusinessModel, channelSetType: string): Promise<number> {
    const activeChannelSet: ChannelSetModel 
      = await this.getActiveChannelSetByBusinessAndCategory(business, channelSetType);

    if (!activeChannelSet) {
      return 0;
    }

    let revenues: DateRevenueInterface[] =
      await this.channelSetTransactionsService.getLastDailyRevenues(activeChannelSet);

    if (!revenues.length) {
      return 0;
    }

    revenues.sort((a: DateRevenueInterface, b: DateRevenueInterface) => a.date < b.date ? 1 : -1);
    revenues = revenues.slice(0, 7);

    return revenues.reduce((total: number, current: DateRevenueInterface) => total += (current.amount || 0), 0 );
  }

  public async getPopularLastWeekForActiveChannelSet(
    business: BusinessModel,
    channelSetType: string,
  ): Promise<ProductModel[]> {
    const activeChannelSet: ChannelSetModel 
      = await this.getActiveChannelSetByBusinessAndCategory(business, channelSetType);

    return activeChannelSet ? this.getPopularLastWeek(activeChannelSet) : [];
  }

  public async getActiveChannelSetByBusinessAndCategory(
    business: BusinessModel,
    channelSetType: string,
  ): Promise<ChannelSetModel> {
    let activeChannelSet: ChannelSetModel;
    const channelSetsForBusiness: ChannelSetModel[] = await this.channelSetService.findByBusiness(business);

    if (!channelSetsForBusiness.length) {
      return;
    }

    const channelSetsByCurrentType: ChannelSetModel[] =
      channelSetsForBusiness.filter( (channelSet: ChannelSetModel) => channelSet.type === channelSetType);

    if (!channelSetsByCurrentType.length) {
      return;
    }

    channelSetsByCurrentType.forEach((channelSet: ChannelSetModel) => {
      if (channelSet.active) {
        activeChannelSet = channelSet;
      }
    });

    return activeChannelSet ? activeChannelSet : channelSetsByCurrentType[0];
  }

  public async getPopularLastWeek(channelSet: ChannelSetModel): Promise<ProductModel[]> {
    const today: Date = new Date();
    const weekAgo: Date = dateFns.addDays(today, -7);

    this.logger.log({
      channelSet: channelSet.id,
      lastSell: {
        $gte : weekAgo,
      },
    });

    return this.productModel.find(
      {
        channelSet: channelSet.id,
        lastSell: {
          $gte : weekAgo,
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

  public async getPopularLastMonth(channelSet: ChannelSetModel): Promise<ProductModel[]> {
    const today: Date = new Date();
    const monthAgo: Date = dateFns.addMonths(today, -1);

    return this.productModel.find(
      {
        channelSet: channelSet.id,
        lastSell: {
          $gte : monthAgo,
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

  public async getLastSold(channelSet: ChannelSetModel): Promise<ProductModel[]> {
    const list: ChannelSetLastSoldProductsListModel = await this.lastSoldProductsList.findById(channelSet.id).exec();

    return list ? list.products : [];
  }
}
