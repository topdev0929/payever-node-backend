import { Types } from 'mongoose';
import { InstalledApp } from './installed-app';
import { UuidDocument } from './uuid-document';
import { ThemeSettingsInterface } from './theme-settings.interface';

export interface Business {
  _id: string;
  installedApps: Types.DocumentArray<InstalledApp & UuidDocument>;
  disallowedApps: Types.DocumentArray<InstalledApp & UuidDocument>;
  themeSettings: ThemeSettingsInterface;
  registrationOrigin: string;
  owner?: string;
}
