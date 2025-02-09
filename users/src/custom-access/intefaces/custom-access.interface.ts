import { CustomAccessEnum } from '../enums';

export interface CustomAccessInterface {
  access: CustomAccessEnum;
  application: string;
  business: string;
  theme: string;
  urls: string;
}
