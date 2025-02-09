import { DashboardInfo } from './dashboard-info';

export class MinRegisteredApp {
  public _id: string;
  public setupStatus: string;
  public code: string;
  public appName: string;
  public tag: string;
  public bootstrapScriptUrl: string;
  public dashboardInfo: DashboardInfo;
  public installed: boolean;
  public default: boolean;
}
