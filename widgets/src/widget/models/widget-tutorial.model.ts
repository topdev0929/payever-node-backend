import { Document } from 'mongoose';
import { WidgetTutorialInterface } from '../interfaces';
import { WidgetModel } from './widget.model';

export interface WidgetTutorialModel extends WidgetTutorialInterface, Document {
  readonly widget: WidgetModel;
}
