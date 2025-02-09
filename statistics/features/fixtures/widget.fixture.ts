import { BaseFixture } from "@pe/cucumber-sdk";
import { businessFactory, DashboardFactory, WidgetFactory, WidgetDataFactory } from './factories';
import {
  WidgetTypeEnum,
  GranularityValueEnum,
  WidgetSettingTypeEnum,
} from '../../src/statistics/enums';

const businessId: string = '568192aa-36ea-48d8-bc0a-8660029e6f72';
const widgetId: string = '31e5db1d-6f0c-431a-a921-db903e8d4447';
const widgetIdWithText: string = '48e0324c-423b-471f-88ee-f0f2f6a62359';
const dashboardId: string = '2a6171ec-6bbe-4c75-9997-e1bf7d6c08cd';

class WidgetFixture extends BaseFixture {
  public async apply(): Promise<void> {

    await this.connection.collection('businesses').insertOne(businessFactory({
      _id: businessId,
    }));

    await this.connection.collection('dashboards').insertOne(DashboardFactory({
      _id: dashboardId,
      businessId: businessId,
    }));

    await this.connection.collection('widgetprops').insertOne(WidgetDataFactory({
      widgetType: WidgetTypeEnum.Transactions,
      props: [
        {
          name : "paymentMethods",
          query : {
            dimensions : [
              "transactions.paymentMethod"
            ],
            timeDimensions : [
              {
                dimension : "transactions.createdAt",
                granularity : "month"
              }
            ],
            filters : [
              {
                member : "transactions.businessId",
                operator : "equals",
                values : [
                    "<BUSINESS_ID>"
                ]
              }
            ]
          }
      }
      ]
    }));

    await this.connection.collection('widgets').insertOne(WidgetFactory({
      _id: widgetId,
      dashboard: dashboardId,
      type: WidgetTypeEnum.Transactions,
      widgetSettings: [[
        [
          {
            type: WidgetSettingTypeEnum.Text,
            value: 'Quantity',
          }, {
            type: WidgetSettingTypeEnum.Granularity,
            value: GranularityValueEnum.Month,
          }, {
            type: WidgetSettingTypeEnum.Metric,
            value: 'totalCount',
          }
        ],
      ]],
    }));
  }
}

export = WidgetFixture;
