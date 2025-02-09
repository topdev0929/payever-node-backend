import { Model } from 'mongoose';
import { BaseFixture } from '@pe/cucumber-sdk';

import { ThemeModel } from '../../src/themes';
import {
  ID_OF_EXISTING_BUSINESS,
} from './const';

class ThemesFixture extends BaseFixture {
  protected readonly themeModel: Model<ThemeModel> = this.application.get(`ThemeModel`);
  public async apply(): Promise<void> {
    await this.themeModel.create({
      _id: ID_OF_EXISTING_BUSINESS,
      businessId: ID_OF_EXISTING_BUSINESS,
      name: 'default',
      isDefault: true,
      settings: {
        bgChatColor: '#2ea6ff',
        accentColor: '#2ea6ff',
        messagesTopColor: '#2ea6ff',
        messagesBottomColor: '#2ea6ff',
        messageAppColor: '#2ea6ff',

        messageWidgetShadow: '1',
        defaultPresetColor: 0,
        customPresetColors: [],
      },
    });

    await this.themeModel.create({
      _id: 'xyz',
      businessId: ID_OF_EXISTING_BUSINESS,
      name: 'light',
      isDefault: false,
      settings: {
        bgChatColor: '#2ea6ff',
        accentColor: '#2ea6ff',
        messagesTopColor: '#2ea6ff',
        messagesBottomColor: '#2ea6ff',
        messageAppColor: '#2ea6ff',

        messageWidgetShadow: '1',
        defaultPresetColor: 0,
        customPresetColors: [],
      },
    });
  }
}

export = ThemesFixture;
