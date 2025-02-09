import { FormFieldValueInterface } from './form-field-value.interface';
import { FormFieldTypeEnum } from '../enums';
import { ActionInterface } from './action.interface';

export interface FormFieldInterface {
  icon?: string;
  name: string;
  placeholder: string;
  required: boolean;
  title: string;
  type: FormFieldTypeEnum;
  values?: FormFieldValueInterface[];
  getValues?: ActionInterface;
  relativeField?: string;
  submitAction?: ActionInterface;
}
