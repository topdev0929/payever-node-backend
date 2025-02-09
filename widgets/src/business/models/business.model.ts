import { Document, Types } from 'mongoose';
import { WidgetInstallationModel, WidgetTutorialModel } from '../../widget/models';
import { BusinessInterface } from '../interfaces';

export interface BusinessModel extends BusinessInterface, Document {
  _id?: string;
  createdAt?: string;
  installations: Types.DocumentArray<WidgetInstallationModel>;
  tutorials: Types.DocumentArray<WidgetTutorialModel>;
}
