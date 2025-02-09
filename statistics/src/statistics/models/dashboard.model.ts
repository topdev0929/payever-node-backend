import { Document } from 'mongoose';
import { DashboardInterface } from '../interfaces';
import { BusinessModel } from '../models';

export interface DashboardModel extends DashboardInterface, Document {
  business?: BusinessModel;
}
