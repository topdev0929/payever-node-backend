import { getModelToken } from '@nestjs/mongoose';
import { BaseFixture } from '@pe/cucumber-sdk/module';
import { Model } from 'mongoose';
import { ChannelSetSchemaName } from '@pe/channels-sdk';
import { WidgetModel } from '../../src/finance-express/interfaces/entities';
import { WidgetSchemaName } from '../../src/finance-express/schemas';
import { BusinessSchemaName } from '../../src/business/schemas';
import { AmountInterface } from '../../src/finance-express/interfaces';

const BUSINESS_ID: string = 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb';
const ANOTHER_BUSINESS_ID: string = 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa';
const WIDGET_ID_1: string = '11111111-1111-1111-1111-111111111111';
const WIDGET_ID_2: string = '22222222-2222-2222-2222-222222222222';
const WIDGET_ID_3: string = '33333333-3333-3333-3333-333333333333';
const WIDGET_ID_4: string = '44444444-4444-4444-4444-444444444444';
const WIDGET_ID_5: string = '55555555-5555-5555-5555-555555555555';
const CHANNEL_SET_ID: string = 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa';
const CHECKOUT_ID: string = '2d873385-5c32-479c-a830-26de40bd4fd1';

class WidgetsListFixture extends BaseFixture {
  private readonly businessModel: Model<any> = this.application.get(getModelToken(BusinessSchemaName));
  private readonly widgetModel: Model<any> = this.application.get(getModelToken(WidgetSchemaName));
  private readonly channelSetModel: Model<any> = this.application.get(getModelToken(ChannelSetSchemaName));

  public async apply(): Promise<void> {
    await this.businessModel.create({
      _id: BUSINESS_ID,
      channelSets: [CHANNEL_SET_ID],
    });

    await this.businessModel.create({
      _id: ANOTHER_BUSINESS_ID,
    });

    await Promise.all([
      this.createWidget(WIDGET_ID_1, BUSINESS_ID),
      this.createWidget(WIDGET_ID_2, BUSINESS_ID),
      this.createWidget(WIDGET_ID_3, ANOTHER_BUSINESS_ID),
      this.createWidget(WIDGET_ID_4, BUSINESS_ID),
      this.createWidget(WIDGET_ID_5, BUSINESS_ID, { min: 100, max: 1000 }),
    ]);

    await this.channelSetModel.create({
      _id: CHANNEL_SET_ID,
      channel: 'dddddddd-dddd-dddd-dddd-dddddddddddd',
    });
  }

  private async createWidget(id: string, businessId: string, amount: AmountInterface = null): Promise<WidgetModel> {
    amount = amount || {
      max: 60,
      min: 10,
    };

    return this.widgetModel.create({
      _id: id,
      amountLimits: amount,
      businessId: businessId,
      channelSet: CHANNEL_SET_ID,
      checkoutId: CHECKOUT_ID,
      checkoutMode: 'calculator',
      checkoutPlacement: 'rightSidebar',
      isVisible: true,
      maxWidth: 1000,
      minWidth: 100,
      payments: [
        {
          amountLimits: {
            max: 2000,
            min: 10,
          },
          isBNPL: false,
          paymentMethod: 'santander_installment',
        },
      ],
      ratesOrder: 'asc',
      styles: { },
      type: 'dropdownCalculator',

      noticeUrl: 'notice_url',
    });
  }
}

export = WidgetsListFixture;
