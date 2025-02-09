import { Document, Types } from 'mongoose';
import { WidgetInstallationModel, WidgetTutorialModel } from '../../widget/models';
import { UserInterface } from '../interfaces';

export interface UserModel extends UserInterface, Document {
  installations: Types.DocumentArray<WidgetInstallationModel>;
  tutorials: Types.DocumentArray<WidgetTutorialModel>;
}
