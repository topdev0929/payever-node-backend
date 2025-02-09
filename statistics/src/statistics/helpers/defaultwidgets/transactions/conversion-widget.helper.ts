import { DateDefaultInterface } from 'src/statistics/interfaces/date-default.interface';
import { BusinessModel } from '../../../models/business.model';
import { WidgetTypeEnum, SizeValueEnum, ViewTypeValueEnum } from '../../../enums';

// tslint:disable: no-duplicate-string
export class ConversionWidget {

  public static buildWidget(
    business: BusinessModel, 
    paymentMethods: string[], 
    channels: string[], 
    businesses: string[],
    dates: DateDefaultInterface,
  ): any {

    return [
      this.daysWidget(business, dates),
      this.paymentMethodWidget(business, paymentMethods, dates),
      this.businessWidget(business, dates),
      this.channelsWidget(business, channels, dates),
    ];
  }

  private static daysWidget(business: BusinessModel, dates: DateDefaultInterface): any {
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
            'value': 'Conversion',
          },
        ],
        [],
        [],
      ],
      [
        [
          {
            'type': 'text',
            'value': 'Day',
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
    ];

    this.addDaysSettings(business, widgetSettings, dates);
    
    return {
      name: 'Transactions',
      size: SizeValueEnum.Large,
      type: WidgetTypeEnum.Checkout,
      viewType: ViewTypeValueEnum.DetailedNumbers,
      widgetSettings: widgetSettings,
    };
  }

  private static addDaysSettings(business: BusinessModel, widgetSettings: any[], dates: DateDefaultInterface): void {
    widgetSettings.push(
        [
          [ 
              {
                  'type' : 'text',
                  'value' : 'Day',
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
                  'value' : 'day',
              }, 
              {
                  'type' : 'metric',
                  'value' : 'conversionRate',
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
                  'value' : 'day',
              }, 
              {
                  'type' : 'metric',
                  'value' : 'conversionRate',
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
      );
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
            'value': 'Conversion',
          },
        ],
        [],
        [],
      ],
      [
        [
          {
            'type': 'text',
            'value': 'Business',
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
    ];

    widgetSettings.push([
      [ 
          {
              'type' : 'text',
              'value' : business._id,
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
              'value' : 'conversionRate',
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
              'value' : 'conversionRate',
          },
          {
            'type' : 'filter',
            'value' : {
                'name' : 'businessId',
                'value' : business._id,
            },
          },
      ],
    ]);
    
    return {
      name: 'Transactions',
      size: SizeValueEnum.Medium,
      type: WidgetTypeEnum.Checkout,
      viewType: ViewTypeValueEnum.DetailedNumbers,
      widgetSettings: widgetSettings,
    };
  }

  private static channelsWidget(business: BusinessModel, channels: string[], dates: DateDefaultInterface): any {
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
            'value': 'Conversion',
          },
        ],
        [],
        [],
      ],
      [
        [
          {
            'type': 'text',
            'value': 'Channels',
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
    ];

    this.addChannelsSettings(business, channels, widgetSettings, dates);
    
    return {
      name: 'Transactions',
      size: SizeValueEnum.Large,
      type: WidgetTypeEnum.Checkout,
      viewType: ViewTypeValueEnum.DetailedNumbers,
      widgetSettings: widgetSettings,
    };
  }

  private static addChannelsSettings(
    business: BusinessModel, channels: string[], widgetSettings: any[], dates: DateDefaultInterface,
  ): void {
    for (const channel of channels) {
      const labeled: string = channel.split('_')
        .map((el: string) => el[0].toUpperCase() + el.substring(1)).join(' ');

      widgetSettings.push(
        [
          [ 
              {
                  'type' : 'text',
                  'value' : labeled,
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
                  'value' : 'conversionRate',
              }, 
              {
                  'type' : 'filter',
                  'value' : {
                      'name' : 'channel',
                      'value' : channel,
                  },
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
                  'value' : 'conversionRate',
              }, 
              {
                  'type' : 'filter',
                  'value' : {
                      'name' : 'channel',
                      'value' : channel,
                  },
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
      );
    }

    widgetSettings.push(
      [
        [ 
            {
                'type' : 'text',
                'value' : 'Total',
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
                'value' : 'conversionRate',
            }, 
            {
              'type' : 'filter',
              'value' : {
                  'name' : 'channel',
                  'operator': 'contains',
                  'values' : channels,
              },
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
                'value' : 'conversionRate',
            }, 
            {
                'type' : 'filter',
                'value' : {
                    'name' : 'channel',
                    'operator': 'contains',
                    'values' : channels,
                },
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
    ); 
  }

  private static paymentMethodWidget(
    business: BusinessModel, paymentMethods: string[], dates: DateDefaultInterface,
  ): any {
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
            'value': 'Conversion',
          },
        ],
        [],
        [],
      ],
      [
        [
          {
            'type': 'text',
            'value': 'Payment Type',
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
    ];

    this.addPaymentSettings(business, paymentMethods, widgetSettings, dates);
    
    return {
      name: 'Transactions',
      size: SizeValueEnum.Large,
      type: WidgetTypeEnum.Checkout,
      viewType: ViewTypeValueEnum.DetailedNumbers,
      widgetSettings: widgetSettings,
    };
  }

  private static addPaymentSettings(
    business: BusinessModel, paymentMethods: string[], widgetSettings: any[], dates: DateDefaultInterface,
  ): void {
    for (const payment of paymentMethods) {
      const labeled: string = payment.split('_')
        .map((el: string) => el[0].toUpperCase() + el.substring(1)).join(' ');

      widgetSettings.push(
        [
          [ 
              {
                  'type' : 'text',
                  'value' : labeled,
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
                  'value' : 'conversionRate',
              }, 
              {
                  'type' : 'filter',
                  'value' : {
                      'name' : 'paymentMethod',
                      'value' : payment,
                  },
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
                  'value' : 'conversionRate',
              }, 
              {
                  'type' : 'filter',
                  'value' : {
                      'name' : 'paymentMethod',
                      'value' : payment,
                  },
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
      );
    }

    widgetSettings.push(
      [
        [ 
            {
                'type' : 'text',
                'value' : 'Total',
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
                'value' : 'conversionRate',
            }, 
            {
              'type' : 'filter',
              'value' : {
                  'name' : 'paymentMethod',
                  'operator': 'contains',
                  'values' : paymentMethods,
              },
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
                'value' : 'conversionRate',
            }, 
            {
                'type' : 'filter',
                'value' : {
                    'name' : 'paymentMethod',
                    'operator': 'contains',
                    'values' : paymentMethods,
                },
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
    ); 
  }
}
