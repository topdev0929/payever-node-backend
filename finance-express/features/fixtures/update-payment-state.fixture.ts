import { getModelToken } from '@nestjs/mongoose';
import { BaseFixture } from '@pe/cucumber-sdk/module';
import { Model } from 'mongoose';
import { WidgetSchemaName } from '../../src/finance-express/schemas';

const BUSINESS_ID: string = 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb';
const WIDGET_ID: string = 'cccccccc-cccc-cccc-cccc-cccccccccccc';
const WIDGET_ID2: string = 'eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee';
const CHANNEL_SET_ID: string = '11111111-1111-1111-1111-111111111111';
const CHECKOUT_ID: string = '2d873385-5c32-479c-a830-26de40bd4fd1';

class UpdateWidgetFixture extends BaseFixture {
  private readonly widgetModel: Model<any> = this.application.get(getModelToken(WidgetSchemaName));

  public async apply(): Promise<void> {
    await this.widgetModel.create({
      _id: WIDGET_ID,
      amount: {
        max: 60,
        min: 10,
      },
      businessId: BUSINESS_ID,
      channelSet: CHANNEL_SET_ID,
      checkoutId: CHECKOUT_ID,
      checkoutMode: 'none',
      displayMode: 'overlay',
      isVisible: true,
      payments: [
        {
          paymentMethod: 'santander_installment',
        },
        {
          paymentMethod: 'santander_factoring_de',
        },
        {
          paymentMethod: 'santander_installment_dk',
        },
      ],
      ratesOrder: 'asc',
      styles: {
        anotherStyle: 'someValue',
        color: 'green',
      },
      type: 'dropdown_calculator',
    });

    await this.widgetModel.create({
      _id: WIDGET_ID2,
      amount: {
        max: 60,
        min: 10,
      },
      businessId: BUSINESS_ID,
      channelSet: CHANNEL_SET_ID,
      checkoutId: CHECKOUT_ID,
      checkoutMode: 'none',
      displayMode: 'overlay',
      isVisible: true,
      payments: [
        {
          enabled: true,
          paymentMethod: 'santander_installment',
        },
        {
          enabled: true,
          paymentMethod: 'santander_factoring_de',
        },
        {
          enabled: true,
          paymentMethod: 'santander_installment_dk',
        },
      ],
      ratesOrder: 'asc',
      styles: {
        anotherStyle: 'someValue',
        color: 'green',
      },
      type: 'dropdown_calculator',
    });
  }
}

export = UpdateWidgetFixture;
