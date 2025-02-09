import { DateDefaultInterface } from 'src/statistics/interfaces/date-default.interface';
import { BusinessModel } from '../models/business.model';
import { ShopModel } from '../../shops/interfaces/entities/shop.model';
import { SizeValueEnum, ViewTypeValueEnum } from '..';
import { WidgetTypeEnum } from '../enums/widget-type.enum';
import { TerminalModel } from '../../pos/interfaces/entities/terminal.model';
import { SiteModel } from '../../sites/interfaces/entities/site.model';
import { MetricEnum } from '../enums/metric.enum';


export class BounceRateWidget {
  public static buildWidget(
    business: BusinessModel,
    shop: ShopModel,
    terminal: TerminalModel,
    site: SiteModel,
    dates: DateDefaultInterface,
  ): any {

    return [
      this.shopBounceRate(business._id, shop, dates),
      this.posBounceRate(business._id, terminal, dates),
      this.siteBounceRate(business._id, site, dates),
    ];
  }

  private static shopBounceRate(businessId: string, shop: ShopModel, dates: DateDefaultInterface): any {
    const widgetSettings: any[] = [
      [
        [
          {
            'type': 'text',
            'value': 'Shop',
          },
        ],
        [],
        [
          {
            'type': 'text',
            'value': 'Bounce Rate',
          },
        ],
      ],
      [
        [
          {
            'type': 'metric',
            'value': MetricEnum.BounceRate,
          },
          {
            'type': 'dateTimeFrom',
            'value': dates.firstFrom,
          },
          {
            'type': 'dateTimeTo',
            'value': dates.firstTo,
          },
          {
            'type': 'granularity',
            'value': 'year',
          },
          {
            'type': 'filter',
            'value': {
              'name': 'businessId',
              'value': businessId,
            },
          },
          {
            'type': 'userInput',
            'value': {
              'name': 'url',
              'value': shop?.domain,
            },
          },
          {
            'type': 'filter',
            'value': {
              'name': 'applicationId',
              'value': shop?.id,
            },
          },
        ],
        [],
      ],
    ];

    return {
      name: 'Shop',
      size: SizeValueEnum.Small,
      type: WidgetTypeEnum.Shop,
      viewType: ViewTypeValueEnum.Percentage,
      widgetSettings: widgetSettings,
    };
  }

  private static posBounceRate(businessId: string, terminal: TerminalModel, dates: DateDefaultInterface): any {
    const widgetSettings: any[] = [
      [
        [
          {
            'type': 'text',
            'value': 'Pos',
          },
        ],
        [],
        [
          {
            'type': 'text',
            'value': 'Bounce Rate',
          },
        ],
      ],
      [
        [
          {
            'type': 'metric',
            'value': MetricEnum.BounceRate,
          },
          {
            'type': 'dateTimeFrom',
            'value': dates.firstFrom,
          },
          {
            'type': 'dateTimeTo',
            'value': dates.firstTo,
          },
          {
            'type': 'granularity',
            'value': 'year',
          },
          {
            'type': 'filter',
            'value': {
              'name': 'businessId',
              'value': businessId,
            },
          },
          {
            'type': 'userInput',
            'value': {
              'name': 'url',
              'value': terminal?.domain,
            },
          },
          {
            'type': 'filter',
            'value': {
              'name': 'applicationId',
              'value': terminal?.id,
            },
          },
        ],
        [],
      ],
    ];

    return {
      name: 'Pos',
      size: SizeValueEnum.Small,
      type: WidgetTypeEnum.Pos,
      viewType: ViewTypeValueEnum.Percentage,
      widgetSettings: widgetSettings,
    };
  }

  private static siteBounceRate(businessId: string, site: SiteModel, dates: DateDefaultInterface): any {
    const widgetSettings: any[] = [
      [
        [
          {
            'type': 'text',
            'value': 'Site',
          },
        ],
        [],
        [
          {
            'type': 'text',
            'value': 'Bounce Rate',
          },
        ],
      ],
      [
        [
          {
            'type': 'metric',
            'value': MetricEnum.BounceRate,
          },
          {
            'type': 'dateTimeFrom',
            'value': dates.firstFrom,
          },
          {
            'type': 'dateTimeTo',
            'value': dates.firstTo,
          },
          {
            'type': 'granularity',
            'value': 'year',
          },
          {
            'type': 'filter',
            'value': {
              'name': 'businessId',
              'value': businessId,
            },
          },
          {
            'type': 'userInput',
            'value': {
              'name': 'url',
              'value': site?.domain,
            },
          },
          {
            'type': 'filter',
            'value': {
              'name': 'applicationId',
              'value': site?.id,
            },
          },
        ],
        [],
      ],
    ];

    return {
      name: 'Site',
      size: SizeValueEnum.Small,
      type: WidgetTypeEnum.Site,
      viewType: ViewTypeValueEnum.Percentage,
      widgetSettings: widgetSettings,
    };
  }
}
