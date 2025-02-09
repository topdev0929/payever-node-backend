import { Document } from 'mongoose';
import { WidgetInterface } from '../interfaces';
import { DashboardModel } from '../models';

export interface WidgetModel extends WidgetInterface, Document {
  dashboard: DashboardModel;
}
