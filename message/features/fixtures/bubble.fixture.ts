import { Model } from 'mongoose';
import { BaseFixture } from '@pe/cucumber-sdk';

import { BubbleModel, BubbleBrandEnum, BubbleStyleEnum, BubbleLayoutEnum } from '../../src/themes';
import {
  ID_OF_EXISTING_BUSINESS,
} from './const';

class BubbleFixture extends BaseFixture {
  protected readonly bubbleModel: Model<BubbleModel> = this.application.get(`BubbleModel`);
  public async apply(): Promise<void> {
    await this.bubbleModel.create({
      _id: ID_OF_EXISTING_BUSINESS,
      businessId: ID_OF_EXISTING_BUSINESS,
      showBubble: true,
      showNotifications: true,
      brand: BubbleBrandEnum.Payever,
      style: BubbleStyleEnum.Circle,
      layout: BubbleLayoutEnum.LogoText,
      logo: '',
      text: '',
      bgColor: '#111111',
      textColor: '#ffffff',
      boxShadow: '#9a9a9aff',
      roundedValue: '12px',
    });
  }
}

export = BubbleFixture;
