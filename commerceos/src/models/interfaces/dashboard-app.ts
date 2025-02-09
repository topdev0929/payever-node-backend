import { Document } from 'mongoose';
import { DashboardInfo } from './dashboard-app/dashboard-info';
import { Access } from './dashboard-app/access';
import { PlatformHeader } from './dashboard-app/platform-header';

export interface DashboardApp {
  _id: string;
  code: string;
  dashboardInfo?: DashboardInfo & Document;
  tag: string;
  access: Access & Document;
  bootstrapScriptUrl: string;
  businessTypes: string[];
  order: number;
  allowedAcls?: {
    create: boolean;
    read: boolean;
    update: boolean;
    delete: boolean;
  };
  platformHeader?: PlatformHeader & Document;
}
