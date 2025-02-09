import { Injectable } from '@nestjs/common';

import { EventDispatcher, EventListener } from '@pe/nest-kit';
import { FoldersEventsEnum, MappedFolderItemInterface } from '@pe/folders-plugin';
import { DashboardModel } from '../models';
import { DashboardEventsEnum } from '../enums';
import { DashboardElasticService } from '../services';
import { MappingHelper } from '../helpers/mapping.helper';

@Injectable()
export class DashboardListener {
  constructor(
    private readonly dashboardElasticService: DashboardElasticService,
    private readonly eventDispatcher: EventDispatcher,
  ) { }

  @EventListener(DashboardEventsEnum.DashboardCreated)
  public async onDashboardCreated(dashboard: DashboardModel): Promise<void> {
    await this.dashboardElasticService.saveIndex(dashboard);

    const folderDocument: MappedFolderItemInterface = MappingHelper.map(dashboard);
    await this.eventDispatcher.dispatch(FoldersEventsEnum.FolderActionCreateDocument, folderDocument);
  }

  @EventListener(DashboardEventsEnum.DashboardUpdated)
  public async onDashboardUpdated(_originalDashboard: DashboardModel, updatedDashboard: DashboardModel): Promise<void> {
    await this.dashboardElasticService.saveIndex(updatedDashboard);

    const folderDocument: MappedFolderItemInterface = MappingHelper.map(updatedDashboard);
    await this.eventDispatcher.dispatch(FoldersEventsEnum.FolderActionUpdateDocument, folderDocument);
  }

  @EventListener(DashboardEventsEnum.DashboardRemoved)
  public async onDashboardRemoved(dashboard: DashboardModel): Promise<void> {
    await this.dashboardElasticService.deleteIndex(dashboard);
    await this.eventDispatcher.dispatch(FoldersEventsEnum.FolderActionDeleteDocument, dashboard._id);
  }
}
