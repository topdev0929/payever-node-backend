import { DateDefaultInterface } from 'src/statistics/interfaces/date-default.interface';
import { WidgetTypeEnum, SizeValueEnum, ViewTypeValueEnum } from '../../../enums';
import { BusinessModel } from '../../../models/business.model';

// tslint:disable: no-duplicate-string
export class SpecialWidget {

  public static buildWidget(
    business: BusinessModel, 
    paymentMethods: string[], 
    channels: string[], 
    businesses: string[],
    dates: DateDefaultInterface,
    ): any {

    return [
      this.businessWidget(business, dates),
    ];
  }

  private static businessWidget(business: BusinessModel, dates: DateDefaultInterface): any {
    const widgetSettings: any[] = [
      [
        [
          {
            'type': 'text',
            'value': WidgetTypeEnum.Checkout,
          },
        ],
        [],
        [],
      ],
      [
        [
          {
            'type': 'text',
            'value': 'Sessions',
          },
        ],
        [],
        [],
      ],
      [
        [
          {
            'type': 'text',
            'value': 'Conversion',
          },
        ],
        [
          {
            'type': 'text',
            'value': `${dates.firstFromFormated} - ${dates.firstToFormated}`,
          },
        ],
        [
          {
            'type': 'text',
            'value': `${dates.secondFromFormated} - ${dates.secondToFormated}`,
          },
        ],
      ],
      [
        [ 
            {
                'type' : 'text',
                'value' : 'Total Sessions',
            },
        ], 
        [ 
            {
                'type' : 'dateTimeFrom',
                'value' : dates.firstFrom,
            }, 
            {
                'type' : 'dateTimeTo',
                'value' : dates.firstTo,
            }, 
            {
                'type' : 'granularity',
                'value' : 'year',
            }, 
            {
                'type' : 'metric',
                'value' : 'countSessions',
            },
            {
              'type' : 'filter',
              'value' : {
                  'name' : 'businessId',
                  'value' : business._id,
              },
            },
        ], 
        [ 
            {
                'type' : 'dateTimeFrom',
                'value' : dates.secondFrom,
            }, 
            {
                'type' : 'dateTimeTo',
                'value' : dates.secondTo,
            }, 
            {
                'type' : 'granularity',
                'value' : 'year',
            }, 
            {
                'type' : 'metric',
                'value' : 'countSessions',
            },
            {
              'type' : 'filter',
              'value' : {
                  'name' : 'businessId',
                  'value' : business._id,
              },
            },
        ],
      ], 
    ];
    
    return {
      name: 'Transactions',
      size: SizeValueEnum.Large,
      type: WidgetTypeEnum.Checkout,
      viewType: ViewTypeValueEnum.DetailedNumbers,
      widgetSettings: widgetSettings,
    };
  }
}
