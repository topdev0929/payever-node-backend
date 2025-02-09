import { BusinessDetailInterface } from './business-detail.interface';
import { CompanyDocumentsInterface } from './company-documents.interface';
import { TaxesInterface } from './taxes.interface';
import { User as UserInterface } from '../schemas/user.schema';
import { WallpaperInterface } from './wallpaper.interface';
import { ThemeSettingsInterface } from './theme-settings.interface';
import { TrafficSourceInterface } from './traffic-source.interface';
import { CurrencyFormatEnum } from '../enums';

export interface BusinessInterface extends Document {
  businessDetail: string | BusinessDetailInterface;
  owner: string | UserInterface;
  name: string;
  logo?: string;
  currentWallpaper?: WallpaperInterface;
  currency?: string;
  currencyFormat?: CurrencyFormatEnum;
  active: boolean;
  hidden: boolean;
  taxes?: TaxesInterface;
  contactEmails?: string[];
  cspAllowedHosts?: string[];
  createdAt?: string;
  documents: CompanyDocumentsInterface;
  themeSettings?: ThemeSettingsInterface;
  trafficSource?: TrafficSourceInterface;
  defaultLanguage?: string;
  registrationOrigin?: string;
}
