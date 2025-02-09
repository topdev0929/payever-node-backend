export interface PopularProductDataInterface {
  _id: string;
  business: string;
  name: string;
  thumbnail: string;
  quantity: number;
  lastSell: Date;
}

export interface CampaignChannelSetInterface {
  _id: string;
  sells: number;
  revenue: number;
  business: string;
  type: string;
}

export interface CampaignDataInterface {
  _id: string;
  name: string;
  contactsCount: number;
  channelSet: CampaignChannelSetInterface;
}

export interface TransactionsAmountDataInterface {
  date: string;
  amount: number;
}

export interface WidgetsBusinessDataInterface {
  business: string;
  campaignDataItem: CampaignDataInterface;
  popularProductWeek: PopularProductDataInterface;
  popularProductMonth: PopularProductDataInterface;
  transactionsDailyData: TransactionsAmountDataInterface[];
  posPopularProductsWeek: any[];
  shopPopularProductsWeek: any[];
  posRevenuesAmountWeek: number;
  shopRevenuesAmountWeek: number;
}
