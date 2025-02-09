import { BusinessModel } from '@pe/business-kit';
import { SizeValueEnum, ViewTypeValueEnum, WidgetTypeEnum } from '../../../enums';

const DEFAULT_PERIOD: string = '30-day Running Recap';

export class DefaultBusinessWidgets {

  public static byChannels(business: BusinessModel, daysAgo: number = 30): any {
    const widgetSettings: any[] = [
      [
        [
          {
            'type': 'text',
            'value': 'By Channel',
          },
        ],
        [],
        [
          {
            'type': 'text',
            'value': DEFAULT_PERIOD,
          },
        ],
      ],
      [
        [
          {
            'value': 'Channels',
            'type': 'text',
          },
        ],
        [
          {
            'value': 'Sales',
            'type': 'text',
          },
        ],
        [
          {
            'value': 'Orders',
            'type': 'text',
          },
        ],
      ],
      [
        [
          {
            'value': 'POS',
            'type': 'text',
          },
        ],
        [
          {
            'type': 'metric',
            'value': 'revenue',
          },
          { 'type': 'daysAgo', 'value': daysAgo },
          {
            'type': 'filter',
            'value': {
              'name': 'channel',
              'value': 'pos',
            },
          },
          {
            'type': 'filter',
            'value': {
              'name': 'businessId',
              'value': business._id,
            },
          },
        ],
        [
          {
            'type': 'metric',
            'value': 'totalCount',
          },
          { 'type': 'daysAgo', 'value': daysAgo },
          {
            'type': 'filter',
            'value': {
              'name': 'businessId',
              'value': business._id,
            },
          },
        ],
      ],
      [
        [
          {
            'value': 'Shop',
            'type': 'text',
          },
        ],
        [
          {
            'type': 'metric',
            'value': 'revenue',
          },
          { 'type': 'daysAgo', 'value': daysAgo },
          {
            'type': 'filter',
            'value': {
              'name': 'channel',
              'value': 'shop',
            },
          },
          {
            'type': 'filter',
            'value': {
              'name': 'businessId',
              'value': business._id,
            },
          },
        ],
        [
          {
            'type': 'metric',
            'value': 'totalCount',
          },
          { 'type': 'daysAgo', 'value': daysAgo },
          {
            'type': 'filter',
            'value': {
              'name': 'channel',
              'value': 'shop',
            },
          },
          {
            'type': 'filter',
            'value': {
              'name': 'businessId',
              'value': business._id,
            },
          },
        ],
      ],
      [
        [
          {
            'value': 'Site',
            'type': 'text',
          },
        ],
        [
          {
            'type': 'metric',
            'value': 'revenue',
          },
          { 'type': 'daysAgo', 'value': daysAgo },
          {
            'type': 'filter',
            'value': {
              'name': 'channel',
              'value': 'link',
            },
          },
          {
            'type': 'filter',
            'value': {
              'name': 'businessId',
              'value': business._id,
            },
          },
        ],
        [
          {
            'type': 'metric',
            'value': 'totalCount',
          },
          { 'type': 'daysAgo', 'value': daysAgo },
          {
            'type': 'filter',
            'value': {
              'name': 'channel',
              'value': 'link',
            },
          },
          {
            'type': 'filter',
            'value': {
              'name': 'businessId',
              'value': business._id,
            },
          },
        ],
      ],
      [
        [
          {
            'value': 'Etc',
            'type': 'text',
          },
        ],
        [
          {
            'type': 'metric',
            'value': 'revenue',
          },
          { 'type': 'daysAgo', 'value': daysAgo },
          {
            'type': 'filter',
            'value': {
              'name': 'businessId',
              'value': business._id,
            },
          },
        ],
        [
          {
            'type': 'metric',
            'value': 'totalCount',
          },
          { 'type': 'daysAgo', 'value': daysAgo },
          {
            'type': 'filter',
            'value': {
              'name': 'businessId',
              'value': business._id,
            },
          },
        ],
      ],
      [
        [],
        [],
        [],
      ],
      [
        [],
        [],
        [],
      ],
    ];

    return {
      name: 'Transactions',
      size: SizeValueEnum.Large,
      type: WidgetTypeEnum.Transactions,
      viewType: ViewTypeValueEnum.DetailedNumbers,
      widgetSettings: widgetSettings,
    };
  }
  public static byChannelsDefaultData(): any {
    return [
      ['By Channel', null, DEFAULT_PERIOD],
      ['Channels', 'Sales', 'Orders'],
      ['POS', 0, 0],
      ['Shop', 0, 0],
      ['Site', 0, 0],
      ['Etc', 0, 0],
      [null, null, null],
      [null, null, null],
    ];
  }


  public static byPaymentOption(business: BusinessModel, daysAgo: number = 30): any {
    const widgetSettings: any[] = [
      [
        [
          {
            'type': 'text',
            'value': 'By Payment Option',
          },
        ],
        [],
        [
          {
            'type': 'text',
            'value': DEFAULT_PERIOD,
          },
        ],
      ],
      [
        [
          {
            'value': 'Payment Option',
            'type': 'text',
          },
        ],
        [
          {
            'value': 'Sales',
            'type': 'text',
          },
        ],
        [
          {
            'value': 'Orders',
            'type': 'text',
          },
        ],
      ],
      [
        [
          {
            'value': 'Suntander',
            'type': 'text',
          },
        ],
        [
          {
            'type': 'metric',
            'value': 'revenue',
          },
          { 'type': 'daysAgo', 'value': daysAgo },
          {
            'type': 'filter',
            'value': {
              'name': 'businessId',
              'value': business._id,
            },
          },
        ],
        [
          {
            'type': 'metric',
            'value': 'totalCount',
          },
          { 'type': 'daysAgo', 'value': daysAgo },
          {
            'type': 'filter',
            'value': {
              'name': 'paymentMethod',
              'operator': 'equals',
              'values': [
                'santander_installment',
                'santander_pos_installment',
                'santander_invoice_de',
                'santander_factoring_de',
                'santander_installment_no',
                'santander_pos_factoring_de',
                'santander_invoice_no',
                'santander_pos_invoice_de',
              ],
            },
          },
          {
            'type': 'filter',
            'value': {
              'name': 'businessId',
              'value': business._id,
            },
          },
        ],
      ],
      [
        [
          {
            'value': 'Zinnia',
            'type': 'text',
          },
        ],
        [
          {
            'type': 'metric',
            'value': 'revenue',
          },
          { 'type': 'daysAgo', 'value': daysAgo },
          {
            'type': 'filter',
            'value': {
              'name': 'paymentMethod',
              'operator': 'equals',
              'values': [
                'zinia_slice_three',
                'zinia_installment_de',
                'zinia_slice_three_de',
                'zinia_pos',
                'zinia_bnpl',
                'zinia_bnpl_de',
              ],
            },
          },
          {
            'type': 'filter',
            'value': {
              'name': 'businessId',
              'value': business._id,
            },
          },
        ],
        [
          {
            'type': 'metric',
            'value': 'totalCount',
          },
          { 'type': 'daysAgo', 'value': daysAgo },
          {
            'type': 'filter',
            'value': {
              'name': 'paymentMethod',
              'operator': 'equals',
              'values': [
                'zinia_bnpl_de',
                'zinia_bnpl',
                'zinia_pos',
                'zinia_slice_three_de',
                'zinia_installment_de',
                'zinia_slice_three',
              ],
            },
          },
          {
            'type': 'filter',
            'value': {
              'name': 'businessId',
              'value': business._id,
            },
          },
        ],
      ],
      [
        [
          {
            'value': 'Allianz B2B BNPL',
            'type': 'text',
          },
        ],
        [
          {
            'type': 'metric',
            'value': 'revenue',
          },
          { 'type': 'daysAgo', 'value': daysAgo },
          {
            'type': 'filter',
            'value': {
              'name': 'paymentMethod',
              'operator': 'equals',
              'values': [
                'allianz_trade_b2b_bnpl',
              ],
            },
          },
          {
            'type': 'filter',
            'value': {
              'name': 'businessId',
              'value': business._id,
            },
          },
        ],
        [
          {
            'type': 'metric',
            'value': 'totalCount',
          },
          { 'type': 'daysAgo', 'value': daysAgo },
          {
            'type': 'filter',
            'value': {
              'name': 'paymentMethod',
              'operator': 'equals',
              'values': [
                'allianz_trade_b2b_bnpl',
              ],
            },
          },
          {
            'type': 'filter',
            'value': {
              'name': 'businessId',
              'value': business._id,
            },
          },
        ],
      ],
      [
        [
          {
            'value': 'Credit Card',
            'type': 'text',
          },
        ],
        [
          {
            'type': 'metric',
            'value': 'revenue',
          },
          { 'type': 'daysAgo', 'value': daysAgo },
          {
            'type': 'filter',
            'value': {
              'name': 'paymentMethod',
              'operator': 'equals',
              'values': [
                'paypal',
                'stripe',
                'instant_payment',
                'stripe_directdebit',
                'openbank',
                'ivy',
                'psa_b2b_bnpl',
                'ideal',
                'sofort',
              ],
            },
          },
          {
            'type': 'filter',
            'value': {
              'name': 'businessId',
              'value': business._id,
            },
          },
        ],
        [
          {
            'type': 'metric',
            'value': 'totalCount',
          },
          { 'type': 'daysAgo', 'value': daysAgo },
          {
            'type': 'filter',
            'value': {
              'name': 'paymentMethod',
              'operator': 'equals',
              'values': [
                'paypal',
                'stripe',
                'instant_payment',
                'stripe_directdebit',
                'openbank',
                'ivy',
                'psa_b2b_bnpl',
                'ideal',
                'sofort',
              ],
            },
          },
          {
            'type': 'filter',
            'value': {
              'name': 'businessId',
              'value': business._id,
            },
          },
        ],
      ],
      [
        [
          {
            'value': 'Cash',
            'type': 'text',
          },
        ],
        [
          {
            'type': 'metric',
            'value': 'revenue',
          },
          { 'type': 'daysAgo', 'value': daysAgo },
          {
            'type': 'filter',
            'value': {
              'name': 'paymentMethod',
              'operator': 'equals',
              'values': [
                'cash',
              ],
            },
          },
          {
            'type': 'filter',
            'value': {
              'name': 'businessId',
              'value': business._id,
            },
          },
        ],
        [
          {
            'type': 'metric',
            'value': 'totalCount',
          },
          { 'type': 'daysAgo', 'value': daysAgo },
          {
            'type': 'filter',
            'value': {
              'name': 'paymentMethod',
              'operator': 'equals',
              'values': [
                'cash',
              ],
            },
          },
          {
            'type': 'filter',
            'value': {
              'name': 'businessId',
              'value': business._id,
            },
          },
        ],
      ],
      [
        [],
        [],
        [],
      ],
    ];

    return {
      name: 'Transactions',
      size: SizeValueEnum.Large,
      type: WidgetTypeEnum.Transactions,
      viewType: ViewTypeValueEnum.DetailedNumbers,
      widgetSettings: widgetSettings,
    };
  }

  public static byPaymentOptionDefaultData(): any  {
    return [
      ['By Payment Option', null, DEFAULT_PERIOD],
      ['Payment Option', 'Sales', 'Orders'],
      ['Suntander', 0, 0],
      ['Zinnia', 0, 0],
      ['Allianz B2B BNPL', 0, 0],
      ['Credit Card', 0, 0],
      ['Cash', 0, 0],
      [null, null, null],
    ];
  }

  public static simpleNumbersDefaultData(name: string = 'default data'): any  {
    return [[name, null, DEFAULT_PERIOD], [0, 0]];
  }

  public static grossSales(business: BusinessModel, daysAgo: number = 30): any {
    const widgetSettings: any[] = [
      [
        [
          {
            'type': 'text',
            'value': 'gross sales',
          },
        ],
        [],
        [
          {
            'type': 'text',
            'value': DEFAULT_PERIOD,
          },
        ],
      ],
      [
        [
          {
            'type': 'metric',
            'value': 'revenue',
          },
          { 'type': 'daysAgo', 'value': daysAgo },
          {
            'type': 'filter',
            'value': {
              'name': 'businessId',
              'value': business._id,
            },
          },
        ],
        [
          {
            'type': 'metric',
            'value': 'revenue',
          },
          { 'type': 'daysAgo', 'value': daysAgo },
          {
            'type': 'filter',
            'value': {
              'name': 'businessId',
              'value': business._id,
            },
          },
        ],
      ],
    ];

    return {
      name: 'Transactions',
      size: SizeValueEnum.Small,
      type: WidgetTypeEnum.Transactions,
      viewType: ViewTypeValueEnum.SimpleNumbers,
      widgetSettings: widgetSettings,
    };
  }

  public static transactions(business: BusinessModel, daysAgo: number = 30): any {
    const widgetSettings: any[] = [
      [
        [
          {
            'type': 'text',
            'value': 'Transactions',
          },
        ],
        [],
        [
          {
            'type': 'text',
            'value': DEFAULT_PERIOD,
          },
        ],
      ],
      [
        [
          {
            'type': 'metric',
            'value': 'countNewPayments',
          },
          { 'type': 'daysAgo', 'value': daysAgo },
          {
            'type': 'filter',
            'value': {
              'name': 'businessId',
              'value': business._id,
            },
          },
        ],
        [
          {
            'type': 'metric',
            'value': 'countSuccessPayments',
          },
          { 'type': 'daysAgo', 'value': daysAgo },
          {
            'type': 'filter',
            'value': {
              'name': 'businessId',
              'value': business._id,
            },
          },
        ],
      ],
    ];

    return {
      name: 'Transactions',
      size: SizeValueEnum.Small,
      type: WidgetTypeEnum.Transactions,
      viewType: ViewTypeValueEnum.SimpleNumbers,
      widgetSettings: widgetSettings,
    };
  }

  public static newCustomers(business: BusinessModel, daysAgo: number = 30): any {
    const widgetSettings: any[] = [
      [
        [
          {
            'type': 'text',
            'value': 'New Customers',
          },
        ],
        [],
        [
          {
            'type': 'text',
            'value': DEFAULT_PERIOD,
          },
        ],
      ],
      [
        [],
        [],
      ],
    ];

    return {
      name: 'Transactions',
      size: SizeValueEnum.Small,
      type: WidgetTypeEnum.Transactions,
      viewType: ViewTypeValueEnum.SimpleNumbers,
      widgetSettings: widgetSettings,
    };
  }

  public static totalCustomers(business: BusinessModel, daysAgo: number = 30): any {
    const widgetSettings: any[] = [
      [
        [
          {
            'type': 'text',
            'value': 'total customers',
          },
        ],
        [],
        [
          {
            'type': 'text',
            'value': DEFAULT_PERIOD,
          },
        ],
      ],
      [
        [],
        [],
      ],
    ];

    return {
      name: 'Transactions',
      size: SizeValueEnum.Small,
      type: WidgetTypeEnum.Transactions,
      viewType: ViewTypeValueEnum.SimpleNumbers,
      widgetSettings: widgetSettings,
    };
  }

  public static averageCartValue(business: BusinessModel, daysAgo: number = 30): any {
    const widgetSettings: any[] = [
      [
        [
          {
            'type': 'text',
            'value': 'Average Cart Value',
          },
        ],
        [],
        [
          {
            'type': 'text',
            'value': DEFAULT_PERIOD,
          },
        ],
      ],
      [
        [
          {
            'type': 'metric',
            'value': 'revenueSuccessAvg',
          },
          { 'type': 'daysAgo', 'value': daysAgo },
          {
            'type': 'filter',
            'value': {
              'name': 'businessId',
              'value': business._id,
            },
          },
        ],
        [
          {
            'type': 'metric',
            'value': 'revenueSuccessAvg',
          },
          { 'type': 'daysAgo', 'value': daysAgo },
          {
            'type': 'filter',
            'value': {
              'name': 'businessId',
              'value': business._id,
            },
          },
        ],
      ],
    ];

    return {
      name: 'Transactions',
      size: SizeValueEnum.Small,
      type: WidgetTypeEnum.Transactions,
      viewType: ViewTypeValueEnum.SimpleNumbers,
      widgetSettings: widgetSettings,
    };
  }
}
