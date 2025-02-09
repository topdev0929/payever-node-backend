import { AppEnum, AppSubTypeEnum } from '../enums';
import { OwnerInterface } from './owner.interface';
export interface SpotlightInterface {
  title: string;
  description: string;
  icon: string;
  currency?: string;
  owner?: OwnerInterface;
  salt?: string;
  subType?: AppSubTypeEnum;
  ownerId?: string;
  businessId?: string;
  serviceEntityId: string;
  app: AppEnum; 
  payload?: any;
  contact?: string[];
}
