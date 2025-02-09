import { QuantityWidget } from './defaultwidgets/transactions';
import { BusinessModel } from '../models';
import { VolumeWidget } from './defaultwidgets/transactions/volume-widget.helper';
import { ConversionWidget } from './defaultwidgets/transactions/conversion-widget.helper';
import { SpecialWidget } from './defaultwidgets/transactions/special-widget.helper';
import * as Moment from 'moment';
import { DateDefaultInterface } from '../interfaces/date-default.interface';
import { ShopModel } from '../../shops/interfaces/entities/shop.model';
import { BounceRateWidget } from './bounce-rate-widget.helper';
import { TerminalModel } from '../../pos/interfaces/entities/terminal.model';
import { SiteModel } from 'src/sites';
import { TotalViewsWidget } from './total-views-widget.helper';
import { UniqueVisitorsWidget } from './unique-visitors-widget.helper';
import { ClickRateAmongVisitorsWidget } from './click-rate-among-visitors-widget.helper';
import { TotalCountAllClicksWidget } from './total-count-all-clicks-widget.helper';
import { EcomRateAmongVisitorsWidget } from './ecom-rate-among-visitors-widget.helper';
import { TotalCountAllEcomsWidget } from './total-count-all-ecoms-widget.helper';
import { SizeValueEnum, ViewTypeValueEnum, WidgetTypeEnum } from '../enums';

export class AdvancedWidgetsHelper {
  public static getDefaultWidgets(
    business: BusinessModel,
    shop: ShopModel,
    terminal: TerminalModel,
    site: SiteModel,
    paymentMethods: string[],
    channels: string[],
    businesses: string[],
  ): any {
    const today: Moment.Moment = Moment();
    const todayYearBefore: Moment.Moment = Moment().subtract(1, 'year');
    const yesterday: Moment.Moment = Moment().subtract(1, 'day');
    const yesterdayNextYear: Moment.Moment = Moment().subtract(1, 'day').add(1, 'year');
    const dates: DateDefaultInterface = {
      firstFrom: todayYearBefore.format('YYYY-MM-DDT00:00:00.000'),
      firstFromFormated: todayYearBefore.format('YYYY.MM.DD'),
      firstTo: yesterday.format('YYYY-MM-DDT23:59:59.999'),
      firstToFormated: yesterday.format('YYYY.MM.DD'),
      secondFrom: today.format('YYYY-MM-DDT00:00:00.000'),
      secondFromFormated: today.format('YYYY.MM.DD'),
      secondTo: yesterdayNextYear.format('YYYY-MM-DDT23:59:59.999'),
      secondToFormated: yesterdayNextYear.format('YYYY.MM.DD'),
    };

    const quantityWidgets: any = QuantityWidget.buildWidget(business, paymentMethods, channels, businesses, dates);
    const volumeWidgets: any = VolumeWidget.buildWidget(business, paymentMethods, channels, businesses, dates);
    const conversionWidgets: any = ConversionWidget.buildWidget(business, paymentMethods, channels, businesses, dates);
    const specialWidgets: any = SpecialWidget.buildWidget(business, paymentMethods, channels, businesses, dates);
    const bounceRateWidgets: any = BounceRateWidget.buildWidget(business, shop, terminal, site, dates);
    const totalViewsWidgets: any = TotalViewsWidget.buildWidget(business, shop, terminal, site, dates);
    const uniqueVisitorsWidgets: any = UniqueVisitorsWidget.buildWidget(business, shop, terminal, site, dates);
    const clickRateAmongVisitorsWidgets: any = ClickRateAmongVisitorsWidget.buildWidget(
      business,
      shop,
      terminal,
      site,
      dates,
    );
    const totalCountAllClicksWidgets: any = TotalCountAllClicksWidget.buildWidget(
      business,
      shop,
      terminal,
      site,
      dates,
    );
    const ecomRateAmongVisitorsWidgets: any = EcomRateAmongVisitorsWidget.buildWidget(
      business,
      shop,
      terminal,
      site,
      dates,
    );
    const totalCountAllEcomsWidgets: any = TotalCountAllEcomsWidget.buildWidget(
      business,
      shop,
      terminal,
      site,
      dates,
    );

    return [...quantityWidgets, ...volumeWidgets, ...conversionWidgets, ...specialWidgets,
    ...bounceRateWidgets, ...totalViewsWidgets, ...uniqueVisitorsWidgets, ...clickRateAmongVisitorsWidgets,
    ...totalCountAllClicksWidgets, ...ecomRateAmongVisitorsWidgets, ...totalCountAllEcomsWidgets,
    ];
  }

}
