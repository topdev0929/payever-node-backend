import { Controller, Logger } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { BusinessService } from '@pe/business-kit';

import { CampaignModel } from '../../apps/marketing-app/models';
import { CampaignAppService } from '../../apps/marketing-app/services';
import { ProductModel } from '../../apps/products-app/models';
import { BusinessProductsAppService, ChannelSetProductsAppService } from '../../apps/products-app/services';
import { DateRevenueInterface } from '../../apps/transactions-app/interfaces';
import { BusinessTransactionsService } from '../../apps/transactions-app/services';
import {
  CampaignDataInterface,
  PopularProductDataInterface,
  TransactionsAmountDataInterface,
  WidgetsBusinessDataInterface,
} from '../interfaces';
import { WidgetsEventsProducer } from '../producers/widgets-events-producer.producer';
import { RequestDataDto } from '../dto/request-data.dto';
import { BusinessModel } from '../../business';
import { ChannelSetModel } from '../../statistics/models';

@Controller()
export class BusMessageController {

  constructor(
    private readonly logger: Logger,
    private readonly businessService: BusinessService,
    private readonly productsAppService: BusinessProductsAppService,
    private readonly transactionsAppService: BusinessTransactionsService,
    private readonly campaignAppService: CampaignAppService,
    private readonly channelSetProductsAppService: ChannelSetProductsAppService,
    private readonly widgetsEventsProducer: WidgetsEventsProducer,
  ) { }

  @MessagePattern({
    name: 'mailer-report.event.report-data.requested',
  })
  public async onMailerReportEvent(data: RequestDataDto): Promise<any> {
    this.logger.log('Received "mailer-report.event.report-data.requested" event');

    if (data.businessIds) {
      const tasks: Array<Promise<WidgetsBusinessDataInterface>> = data.businessIds.map(async (businessId: string) => {

        const business: BusinessModel = await this.businessService.findOneById(businessId) as unknown as BusinessModel;

        const campaigns: CampaignModel[] = await this.campaignAppService.getLast(business);

        const weekProducts: ProductModel[] = await this.productsAppService.getPopularLastWeek(business);

        const monthProducts: ProductModel[] = await this.productsAppService.getPopularLastMonth(business);

        const transactions: DateRevenueInterface[] = await this.transactionsAppService.getLastDailyRevenues(business);

        const posPopularProductsWeek: ProductModel[] =
          await this.channelSetProductsAppService.getPopularLastWeekForActiveChannelSet(business, 'pos');

        const shopPopularProductsWeek: ProductModel[] =
          await this.channelSetProductsAppService.getPopularLastWeekForActiveChannelSet(business, 'shop');

        const posRevenuesAmountWeek: number =
          await this.channelSetProductsAppService.getWeekRevenuesAmount(business, 'pos');

        const shopRevenuesAmountWeek: number =
          await this.channelSetProductsAppService.getWeekRevenuesAmount(business, 'shop');

        return {
          business: businessId,
          campaignDataItem: this.getCampaignData(campaigns),
          popularProductMonth: this.getProductData(monthProducts, businessId),
          popularProductWeek: this.getProductData(weekProducts, businessId),
          posPopularProductsWeek,
          posRevenuesAmountWeek,
          shopPopularProductsWeek,
          shopRevenuesAmountWeek,
          transactionsDailyData: this.getTransactionsAmount(transactions),
        };
      });

      let result: WidgetsBusinessDataInterface[];

      try {

        result = await Promise.all(tasks);

      } catch (error) {
        this.logger.error({
          businessIds: JSON.stringify(data.businessIds),
          error: error.message,
          message: '"mailer-report.event.report-data.requested" error during data query.',
        });

        result = data.businessIds.map((businessId: string) => ({
          business: businessId,
          campaignDataItem: null,
          errorOnDataQuery: true,
          popularProductMonth: null,
          popularProductWeek: null,
          posPopularProductsWeek: null,
          posRevenuesAmountWeek: null,
          shopPopularProductsWeek: null,
          shopRevenuesAmountWeek: null,
          transactionsDailyData: null,
        }));
      }

      await this.widgetsEventsProducer.produceWidgetsReportDataPreparedEvent(result);
    }
  }

  private getTransactionsAmount(transactions: DateRevenueInterface[]): TransactionsAmountDataInterface[] {
    if (!transactions || !transactions.length) {
      return null;
    }

    return transactions.map((transaction: DateRevenueInterface) => {
      return {
        amount: transaction.amount,
        currency: transaction.currency,
        date: transaction.date,
      };
    });

  }

  private getCampaignData(campaigns: CampaignModel[]): CampaignDataInterface {

    if (!campaigns || !campaigns.length) {
      return null;
    }

    const campaignModel: CampaignModel = campaigns[0];
    const channelSetData: ChannelSetModel = campaignModel.channelSet as ChannelSetModel;

    return {
      _id: campaignModel._id,
      channelSet: channelSetData && {
        _id: channelSetData._id,
        business: (channelSetData.business || { _id: null })._id,
        revenue: channelSetData.revenue,
        sells: channelSetData.sells,
        type: channelSetData.type,
      } || null,
      contactsCount: campaignModel.contactsCount,
      name: campaignModel.name,
    };
  }

  private getProductData(products: ProductModel[], business: string): PopularProductDataInterface {

    if (!products || !products.length) {
      return null;
    }

    const productModel: ProductModel = products[0];

    return {
      _id: productModel._id as string,
      business: productModel.businessUuid,
      lastSell: productModel.lastSell,
      name: productModel.name,
      quantity: productModel.quantity,
      thumbnail: productModel.thumbnail,
    };
  }
}
