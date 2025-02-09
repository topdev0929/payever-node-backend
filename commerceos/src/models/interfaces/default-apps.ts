import { Document, Types } from 'mongoose';
import { InstalledApp } from './installed-app';

export interface DefaultApps {
  _id: string;
  installedApps: Types.DocumentArray<InstalledApp & Document>;
}
