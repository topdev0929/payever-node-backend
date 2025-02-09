import { ActionInterface } from './action.interface';
import { OnboardingTypeEnum } from '../enums';
import { FormFieldInterface } from './form-field.interface';

export interface OnboardingInterface {
  name: string;
  logo: string;
  type: OnboardingTypeEnum;
  wallpaperUrl: string;
  afterLogin?: ActionInterface[];
  afterRegistration?: ActionInterface[];
  accountFlags?: any;
  form?: FormFieldInterface[];
  defaultLoginByEmail?: boolean;
  redirectUrl?: string;
}
