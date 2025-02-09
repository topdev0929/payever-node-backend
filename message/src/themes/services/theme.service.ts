import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { BusinessLocalDocument as BusinessModel } from '../../projections/models';
import { UpdateThemeDto } from '../dto';
import { ThemeModel } from '../models';
import { ThemeSchemaName } from '../schemas';
import { defaultThemes } from '../themes.constant';

@Injectable()
export class ThemeService {
  constructor(
    @InjectModel(ThemeSchemaName)
    private readonly themeModel: Model<ThemeModel>,
  ) { }

  public async find(
    business: BusinessModel,
  ): Promise<{ currentTheme: string; themes: ThemeModel[] }> {
    let themes: ThemeModel[] = await this.themeModel.find({
      businessId: business._id,
    }).exec();

    let defaultTheme: ThemeModel;
    if (themes.length === 0) {
      themes = await this.createDefaults(business);
    }

    defaultTheme = themes.find((item: ThemeModel) => item.isDefault);
    if (!defaultTheme) {
      defaultTheme = themes[0];

      await this.themeModel.findByIdAndUpdate(defaultTheme._id, { isDefault: true }).exec();
    }

    return {
      currentTheme: defaultTheme.name,
      themes,
    };
  }

  public async update(
    theme: ThemeModel,
    dto: UpdateThemeDto,
  ): Promise<ThemeModel> {
    const changedTheme: ThemeModel = await this.themeModel.findOneAndUpdate(
      {
        _id: theme._id,
      },
      dto,
      {
        new: true,
      },
    ).exec();

    if (dto.isDefault && changedTheme.isDefault) {
      await this.themeModel.updateMany(
        {
          _id: { $ne: changedTheme._id },
          businessId: theme.businessId,
        },
        {
          isDefault: false,
        },
      ).exec();
    }

    return changedTheme;
  }

  private async createDefaults(business: BusinessModel): Promise<ThemeModel[]> {
    const themes: ThemeModel[] = [];

    for (let i: number = 0; i < defaultThemes.length; i++) {
      const theme: ThemeModel = await this.themeModel.create({
        ...defaultThemes[i],
        businessId: business._id,
        isDefault: i === 0,
      });
      themes.push(theme);
    }

    return themes;
  }
}
