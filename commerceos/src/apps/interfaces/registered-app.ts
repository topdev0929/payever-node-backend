import { DashboardApp } from '../../models/interfaces/dashboard-app';
import { PlatformHeader } from '../../models/interfaces/dashboard-app/platform-header';
import { DashboardInfo } from './dashboard-info';

export class RegisteredApp {
  public _id: string;
  public allowedAcls: {
    create: boolean;
    delete?: boolean;
    read: boolean;
    update?: boolean;
  };
  public bootstrapScriptUrl: string;
  public code: string;
  public appName: string;
  public dashboardInfo: DashboardInfo;
  public default: boolean;
  public installed: boolean;
  public microUuid: string;
  public order: number;
  public platformHeader: PlatformHeader;
  public statusChangedAt: Date;
  public setupStatus: string;
  public setupStep: string;
  public tag: string;
  public url: string;
  public businessTypes?: string[];

  public static parse(ia: {
    app: DashboardApp;
    installed?: boolean;
    setupStatus?: string;
    setupStep?: string;
    statusChangedAt?: Date;
  }): RegisteredApp {
    const app: DashboardApp = ia.app;

    if (!app) {
      return ;
    }

    return {
      _id: app._id,
      allowedAcls: app.allowedAcls,
      appName: `commerceos.${app.code}.app.name`,
      bootstrapScriptUrl: app.bootstrapScriptUrl,
      businessTypes: app.businessTypes && app.businessTypes.length > 0 ? app.businessTypes : [ 'business' ],
      code: app.code,
      dashboardInfo: app.dashboardInfo?.toObject(),
      default: app.access.business?.isDefault,
      installed: ia.installed,
      microUuid: app._id,
      order: app.order,
      platformHeader: app.platformHeader?.toObject(),
      setupStatus: ia.setupStatus,
      setupStep: ia.setupStep,
      statusChangedAt: ia.statusChangedAt,
      tag: app.tag,
      url: app.access.business?.url,
    };
  }
}
