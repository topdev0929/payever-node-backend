import { Document } from 'mongoose';
import { WidgetSettingInterface } from '../interfaces';

export interface WidgetSettingModel extends WidgetSettingInterface, Document { }
