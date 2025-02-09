import { DefaultBusinessWidgets, QuantityWidget } from './defaultwidgets/transactions';
import { BusinessModel } from '../models';

import { ShopModel } from '../../shops/interfaces/entities/shop.model';
import { TerminalModel } from '../../pos/interfaces/entities/terminal.model';
import { SiteModel } from '../../sites';

export class DefaultWidgetsHelper {
  public static getDefaultWidgets(
    business: BusinessModel,
    shop: ShopModel,
    terminal: TerminalModel,
    site: SiteModel,
    paymentMethods: string[],
    channels: string[],
    businesses: string[],
  ): any {
    
    return [
      DefaultBusinessWidgets.grossSales(business, 30),
      DefaultBusinessWidgets.transactions(business, 30),
      DefaultBusinessWidgets.averageCartValue(business, 30),
      DefaultBusinessWidgets.byChannels(business, 30),
      DefaultBusinessWidgets.byPaymentOption(business, 30),
    ];
  }
}
