import { Document } from 'mongoose';
import { FormFieldValueInterface } from '../interfaces';

export interface FormFieldValueModel extends FormFieldValueInterface, Document { }
