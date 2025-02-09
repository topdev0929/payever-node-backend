import { LeanDocument } from 'mongoose';
import { AffiliateBrandingModel } from '../../affiliates/models';
import { AccessConfigModel } from '../models';

export type WithAccessConfig<T> = T & {
  accessConfig: AccessConfigModel;
};
export type AppWithAccessConfigDto = LeanDocument<WithAccessConfig<LeanDocument<AffiliateBrandingModel>>>;
