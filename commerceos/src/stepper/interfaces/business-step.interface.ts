import { SectionsEnum } from '../enums';

export interface BusinessStepInterface {
  businessId: string;
  isActive: boolean;
  step: string;
  section: SectionsEnum;
}
