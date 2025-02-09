import { Document } from 'mongoose';
import { SettingsInterface } from '../interfaces';

export interface SettingsModel extends SettingsInterface, Document { }
