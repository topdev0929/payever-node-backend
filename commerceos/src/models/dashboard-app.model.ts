import { dashboardAppSchema } from './schemas/dashboard-app.schema';
import { model, Model } from 'mongoose';
import { DashboardApp } from './interfaces/dashboard-app';
import { UuidDocument } from './interfaces/uuid-document';

export interface DashboardAppModel extends DashboardApp, UuidDocument { }

export const dashboardAppModel: Model<DashboardAppModel> = model<DashboardAppModel>(
  'DashboardApps',
  dashboardAppSchema,
);
