import { getModelToken } from '@nestjs/mongoose';
import { BaseFixture } from '@pe/cucumber-sdk';
import * as fs from 'fs';
import { Model } from 'mongoose';
import { ThemesSchemaNamesEnum } from '@pe/builder-kit/module/themes';

class DefaultThemeFixture extends BaseFixture {
  private themeModel: Model<any> = this.application.get(getModelToken(ThemesSchemaNamesEnum.Theme));
  private themeSnapshotModel: Model<any> = this.application.get(getModelToken(ThemesSchemaNamesEnum.ThemeSnapshot));
  private themePageModel: Model<any> = this.application.get(getModelToken(ThemesSchemaNamesEnum.ThemePage));

  public async apply(): Promise<void> {
    const snapshotJson: string = fs.readFileSync('features/fixtures/data/snapshot.json', 'utf8');
    await this.themeSnapshotModel.create(JSON.parse(snapshotJson));

    const pageJson: string = fs.readFileSync('features/fixtures/data/page.json', 'utf8');
    await this.themePageModel.create(JSON.parse(pageJson));

    const themeJson: string = fs.readFileSync('features/fixtures/data/theme.json', 'utf8');
    await this.themeModel.create(JSON.parse(themeJson));
  }
}

export = DefaultThemeFixture;
