import { Command } from '@pe/nest-kit';
import { Injectable, Logger } from '@nestjs/common';
import { Types, Model } from 'mongoose';
import { InstalledApp } from './../models/interfaces/installed-app';
import { UuidDocument } from './../models/interfaces/uuid-document';
import { BusinessModel, businessModel as bm } from '../models/business.model';
import { InjectModel } from '@nestjs/mongoose';
import { DashboardAppModel, dashboardAppModel as am } from '../models/dashboard-app.model';
import { DefaultAppsModel, defaultAppsModel as dm } from '../models/default-apps.model';
import { UserModel, userModel as um } from '../models/user.model';

@Injectable()
export class FixBusinessAppsCommand {
  constructor(
    @InjectModel(bm.modelName) private readonly businessModel: Model<BusinessModel>,
    @InjectModel(am.modelName) private readonly dashboardAppModel: Model<DashboardAppModel>,
    @InjectModel(dm.modelName) private readonly defaultAppsModel: Model<DefaultAppsModel>,
    @InjectModel(um.modelName) private readonly userModel: Model<UserModel>,
    private readonly logger: Logger,
  ) { }

  @Command({
    aliases: 'Find businesses with unexisting installedApps. Then copy installedApps from default.',
    command: 'fix:apps',
  })
  public async run(): Promise<void> {
    const fb: number = await this.fixBusinesses();
    this.logger.log(`Reset installedApps for ${fb} businesses.`);

    const fu: number = await this.fixUsers();
    this.logger.log(`Reset installedApps for ${fu} users.`);
  }

  private async fixBusinesses(): Promise<number> {
    let i: number = 0;
    const businesses: BusinessModel[] = await this.businessModel.find().exec();
    for (const business of businesses) {
      const notFound: string[] = [];
      for (const ia of business.installedApps) {
        const app: DashboardAppModel = await this.dashboardAppModel.findById(ia.app).exec();
        if (!app) {
          notFound.push(ia.app);
        }
      }
      if (notFound.length) {
        await this.resetBusinessInstalledApps(business._id);
        i++;
      }
    }

    return i;
  }

  private async resetBusinessInstalledApps(businessId: string): Promise<void> {
    const def: DefaultAppsModel = await this.defaultAppsModel.findById('business').exec();
    await this.businessModel
      .findByIdAndUpdate(
        { _id: businessId },
        {
          $set: { installedApps: def.installedApps as Types.DocumentArray<InstalledApp & UuidDocument> },
        }
      ).exec();
  }

  private async fixUsers(): Promise<number> {
    let i: number = 0;
    const users: UserModel[] = await this.userModel.find().exec();
    for (const user of users) {
      const notFound: string[] = [];
      for (const ia of user.installedApps) {
        const app: DashboardAppModel = await this.dashboardAppModel.findById(ia.app).exec();
        if (!app) {
          notFound.push(ia.app);
        }
      }
      if (notFound.length) {
        await this.resetUserInstalledApps(user._id);
        i++;
      }
    }

    return i;
  }

  private async resetUserInstalledApps(userId: string): Promise<void> {
    const def: DefaultAppsModel = await this.defaultAppsModel.findById('user').exec();
    await this.userModel
      .findByIdAndUpdate(
        { _id: userId },
        {
          $set: { installedApps: def.installedApps as Types.DocumentArray<InstalledApp & UuidDocument> },
        }
      ).exec();
  }
}
