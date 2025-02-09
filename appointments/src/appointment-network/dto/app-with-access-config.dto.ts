import { LeanDocument } from 'mongoose';
import { AccessConfigModel, AppointmentNetworkModel } from '../models';

export type WithAccessConfig<T> = T & {
  accessConfig: AccessConfigModel;
};

export type AppWithAccessConfigDto = LeanDocument<WithAccessConfig<LeanDocument<AppointmentNetworkModel>>>;
