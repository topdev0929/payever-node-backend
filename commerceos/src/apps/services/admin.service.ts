import * as mongodb from 'mongodb';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { DefaultAppsModel } from '../../models/default-apps.model';
import { DashboardAppModel } from '../../models/dashboard-app.model';
import { DefaultApps } from '../../models/interfaces/default-apps';
import { DashboardApp } from '../../models/interfaces/dashboard-app';

type DeleteOneResult = mongodb.DeleteWriteOpResultObject['result'] & { deletedCount?: number };

@Injectable()
export class AdminService {
  constructor(
    @InjectModel('DefaultApps') private readonly defaultAppsModel: Model<DefaultAppsModel>,
    @InjectModel('DashboardApps') private readonly dashboardAppsModel: Model<DashboardAppModel>,
  ) { }

  public async getDefaultApps(): Promise<DefaultAppsModel[]> {
    return this.defaultAppsModel.find({ });
  }

  public async getDefaultAppsById(id: string): Promise<DefaultAppsModel> {
    return this.defaultAppsModel.findById(id);
  }

  public async updateDefaultAppsById(id: string, dto: DefaultApps): Promise<DefaultAppsModel> {
    await this.defaultAppsModel.updateOne(
      { _id: id },
      {
        $set: dto,
      },
    );

    return this.getDefaultAppsById(id);
  }

  public async removeDefaultAppsById(id: string): Promise<DeleteOneResult> {
    return this.defaultAppsModel.deleteOne(
      { _id: id },
    );
  }

  public async createDefaultApp(dto: DefaultApps): Promise<DefaultAppsModel> {
    return this.defaultAppsModel.create(dto);
  }

  public async getDashboardApps(): Promise<DashboardAppModel[]> {
    return this.dashboardAppsModel.find({ });
  }

  public async getDashboardAppsById(id: string): Promise<DashboardAppModel> {
    return this.dashboardAppsModel.findById(id);
  }

  public async updateDashboardAppsById(id: string, dto: DashboardApp): Promise<DashboardAppModel> {
    await this.dashboardAppsModel.updateOne(
      { _id: id },
      {
        $set: dto,
      },
    );

    return this.getDashboardAppsById(id);
  }

  public async createDashboardApp(dto: DashboardApp): Promise<DashboardAppModel> {
    return this.dashboardAppsModel.create(dto);
  }

  public async removeDashboardAppsById(id: string): Promise<DeleteOneResult> {
    return this.dashboardAppsModel.deleteOne(
      { _id: id },
    );
  }
}
