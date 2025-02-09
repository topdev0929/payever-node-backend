import { DashboardAppModel } from '../dashboard-app.model';

interface InstalledAppBase {
  /**
   * @deprecated Use app.code instead
   */
  code: string;
  installed: boolean;
  setupStatus: string;
  statusChangedAt: Date;
  setupStep: string;
}

export interface InstalledAppPopulatedApp extends InstalledAppBase {
  app: DashboardAppModel;
}

export interface InstalledApp extends InstalledAppBase {
  app: string;
}
