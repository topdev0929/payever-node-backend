import { Document, Types } from 'mongoose';

import { OnboardingInterface } from '../interfaces';
import { ActionModel } from './action.model';
import { FormFieldModel } from './form-field.model';

export interface OnboardingModel extends OnboardingInterface, Document {
  name: string;
  logo: string;
  wallpaperUrl: string;
  afterLogin: Types.DocumentArray<ActionModel>;
  afterRegistration: Types.DocumentArray<ActionModel>;
  form: Types.DocumentArray<FormFieldModel>;
  accountFlags: any;
  defaultLoginByEmail: boolean;
  redirectUrl: string;
}
