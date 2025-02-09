import { Types } from 'mongoose';
import { InstalledApp } from './installed-app';
import { UuidDocument } from './uuid-document';
import { ThemeSettingsInterface } from './theme-settings.interface';

export interface User {
  _id: string;
  installedApps: Types.DocumentArray<InstalledApp & UuidDocument>;
  themeSettings: ThemeSettingsInterface;
}
