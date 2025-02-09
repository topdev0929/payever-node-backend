import { LeanDocument } from 'mongoose';
import { AccessConfigModel, SubscriptionNetworkModel } from '../models';

export type WithAccessConfig<T> = T & {
  accessConfig: AccessConfigModel;
};

export type AppWithAccessConfigDto = LeanDocument<WithAccessConfig<LeanDocument<SubscriptionNetworkModel>>>;
