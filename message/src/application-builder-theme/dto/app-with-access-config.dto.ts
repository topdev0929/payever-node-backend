import { LeanDocument } from 'mongoose';
import { AccessConfigModel } from '../models';

export type WithAccessConfig<T> = T & {
  accessConfig: AccessConfigModel;
};
export type AppWithAccessConfigDto = LeanDocument<WithAccessConfig<any>>;
