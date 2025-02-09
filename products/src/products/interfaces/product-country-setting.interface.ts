import { Document } from 'mongoose';
import { CountrySettingInterface } from './country-setting.interface';

export interface ProductCountrySettingInterface extends Document {
  product: string;
  countrySettings: { [key: string] : CountrySettingInterface };
}
