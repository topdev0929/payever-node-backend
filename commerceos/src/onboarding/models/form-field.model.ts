import { Document, Types } from 'mongoose';
import { FormFieldValueModel } from './form-field-value.model';
import { FormFieldInterface } from '../interfaces';

export interface FormFieldModel extends FormFieldInterface, Document {
  values: Types.DocumentArray<FormFieldValueModel>;
}
