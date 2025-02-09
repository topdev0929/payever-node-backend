import { Document } from 'mongoose';
import { WidgetInstallationInterface } from '../interfaces';
import { WidgetModel } from './widget.model';

export interface WidgetInstallationModel extends WidgetInstallationInterface, Document {
  readonly widget: WidgetModel;
}
