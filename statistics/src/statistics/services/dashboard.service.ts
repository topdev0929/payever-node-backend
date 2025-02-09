import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { EventDispatcher } from '@pe/nest-kit';
import { CreatedByEnum, DashboardEventsEnum } from '../enums';
import { CreateDashboardDto, UpdateDashboardDto } from '../dto';
import { BusinessModel, DashboardModel } from '../models';
import { DashboardSchemaName } from '../schemas';
import { DefaultWidgetsService } from './default-widgets.service';
import { ShopModel } from '../../shops/interfaces/entities/shop.model';
import { ShopService } from '../../shops/services/shop.service';
import { TerminalModel } from '../../pos/interfaces/entities/terminal.model';
import { PosService } from '../../pos/services/pos.service';
import { SiteService } from '../../sites/services/site.service';
import { SiteModel } from '../../sites/interfaces/entities/site.model';

@Injectable()
export class DashboardService {
  constructor(
    @InjectModel(DashboardSchemaName)
    private readonly dashboardModel: Model<DashboardModel>,
    private readonly defaultWidgetsService: DefaultWidgetsService,
    private readonly shopService: ShopService,
    private readonly posService: PosService,
    private readonly siteService: SiteService,
    private readonly eventDispatcher: EventDispatcher,
  ) { }

  public async create(dto: CreateDashboardDto, business: BusinessModel): Promise<DashboardModel> {
    const isFirstDashboard: boolean = !await this.dashboardModel.exists({
      businessId: business._id,
    });
    const dashboard: DashboardModel = await this.dashboardModel.create({
      businessId: business._id,
      name: dto.name,
      isDefault: isFirstDashboard,
    });
    dashboard.depopulate('business');

    const result: DashboardModel = await this.dashboardModel.findById(dashboard._id).populate('business').exec();
    const shop: ShopModel = await this.shopService.getDefaultShopByBusiness(business._id);
    const terminal: TerminalModel = await this.posService.getDefaultTerminalByBusiness(business._id);
    const site: SiteModel = await this.siteService.getDefaultSiteByBusiness(business._id);
    await this.defaultWidgetsService.build(dashboard, business, shop, terminal, site);

    await this.eventDispatcher.dispatch(DashboardEventsEnum.DashboardCreated, dashboard);

    return result;
  }

  public async createForAdmin(dto: CreateDashboardDto): Promise<DashboardModel> {
    const dashboard: DashboardModel = await this.dashboardModel.create({
      createdBy: CreatedByEnum.Amdin,
      name: dto.name,
    });
    dashboard.depopulate('business');

    const result: DashboardModel = await this.dashboardModel.findById(dashboard._id).exec();

    await this.eventDispatcher.dispatch(DashboardEventsEnum.DashboardCreated, dashboard);

    return result;
  }

  public async findOneById(dashboardId: string): Promise<DashboardModel> {
    return this.dashboardModel.findById(dashboardId).populate('business').exec();
  }

  public async findAll(): Promise<DashboardModel[]> {
    return this.dashboardModel.find({ }).sort({ name: 1 }).populate('business').exec();
  }

  public async findAllForAdmin(): Promise<DashboardModel[]> {
    return this.dashboardModel.find({ createdBy: CreatedByEnum.Amdin }).sort({ name: 1 }).exec();
  }

  public async findAllByBusiness(business: BusinessModel): Promise<DashboardModel[]> {
    return this.dashboardModel.find({ businessId: business._id }).sort({ name: 1 }).populate('business').exec();
  }

  public async remove(dashboard: DashboardModel): Promise<void> {
    await this.dashboardModel.deleteOne({ _id: dashboard.id }).exec();

    await this.eventDispatcher.dispatch(DashboardEventsEnum.DashboardRemoved, dashboard);
  }

  public async update(dashboard: DashboardModel, dto: UpdateDashboardDto): Promise<DashboardModel> {
    const updatedData: any = { };
    Object.keys(dto).forEach((key: string) => {
      updatedData[`${key}`] = dto[key];
    });

    await this.dashboardModel.updateOne(
      { _id: dashboard.id },
      { $set: updatedData },
    ).exec();

    const updatedDashboard: DashboardModel = await this.dashboardModel.findById(dashboard._id);

    await this.eventDispatcher.dispatch(DashboardEventsEnum.DashboardUpdated, dashboard, updatedDashboard);

    return this.dashboardModel.findById(dashboard.id).populate('business').exec();
  }

  public async setAsDefault(dashboard: DashboardModel): Promise<DashboardModel> {
    if (dashboard.isDefault) {
      return this.dashboardModel.findById(dashboard.id).populate('business').exec();
    }
    const prevDefaultDashboards: DashboardModel[] = await this.dashboardModel.find({
      businessId: dashboard.businessId,
      isDefault: true,
    }).exec();

    await this.dashboardModel.updateMany(
      {
        _id: {
          $in: prevDefaultDashboards.map(a => a.id),
        },
      },
      {
        $set: {
          isDefault: false,
        },
      }
    );

    const updatedPrevDefaultDashboards: DashboardModel[] = await this.dashboardModel
      .find({ _id: { $in: prevDefaultDashboards.map(a => a.id) } }).exec();

    for (const prevDefaultDashboard of prevDefaultDashboards) {
      const updatedPrevDefaultDashboard: DashboardModel = updatedPrevDefaultDashboards
        .find(a => a._id === prevDefaultDashboard._id);
      await this.eventDispatcher.dispatch(
        DashboardEventsEnum.DashboardUpdated,
        prevDefaultDashboard,
        updatedPrevDefaultDashboard,
      );
    }

    await this.dashboardModel.updateOne(
      { _id: dashboard.id },
      { $set: { isDefault: true } },
    ).exec();

    const updatedDashboard: DashboardModel = await this.dashboardModel.findById(dashboard._id);

    await this.eventDispatcher.dispatch(DashboardEventsEnum.DashboardUpdated, dashboard, updatedDashboard);

    return this.dashboardModel.findById(dashboard.id).populate('business').exec();
  }
}
