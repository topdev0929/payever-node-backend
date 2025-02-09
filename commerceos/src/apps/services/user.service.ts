import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Types, Model } from 'mongoose';
import { InstalledApp } from '../../models/interfaces/installed-app';
import { UuidDocument } from '../../models/interfaces/uuid-document';
import { DefaultAppsModel } from '../../models/default-apps.model';
import { UserModel } from '../../models/user.model';
import { UserDto } from '../dto/user.dto';
import { ThemeSettingsDto } from '../../business/dto';
import { ThemesEnum } from '../../business/enums';

@Injectable()
export class UserService {
  constructor(
    @InjectModel('User') private readonly userModel: Model<UserModel>,
    @InjectModel('DefaultApps') private readonly defaultAppsModel: Model<DefaultAppsModel>,
  ) { }

  public async getOrCreate(id: string, defaultId: string): Promise<UserModel> {
    let user: UserModel = await this.userModel.findById(id);

    if (!user) {
      try {
        const defaultApps: DefaultAppsModel = await this.defaultAppsModel.findById(defaultId);
        const themeSettings: ThemeSettingsDto = {
          theme: ThemesEnum.Default,
        };

        user = await this.userModel.findOneAndUpdate(
          { _id: id },
          {
            $set: {
              installedApps: (defaultApps ?
                defaultApps.installedApps
                : []) as Types.DocumentArray<InstalledApp & UuidDocument>,
            },
            $setOnInsert: {
              _id: id,
              themeSettings,
            },
          },
          {
            new: true,
            upsert: true,
          },
        );
      } catch (err) {
        if (err.name === 'MongoError' && err.code === 11000) {
          user = await this.userModel.findById(id);
        } else {
          throw err;
        }
      }
    }

    return user;
  }

  public async update(updateDto: UserDto): Promise<UserModel> {
    return this.userModel.findOneAndUpdate(
      {
        _id: updateDto._id,
      },
      {
        $set: {
          themeSettings: {
            theme: updateDto.themeSettings.theme,
          },
        },
      },
      {
        new: true,
      },
    );
  }
}
