import { Document } from 'mongoose';
import { EmailSettingsInterface } from '../interfaces/email-settings.interface';

export interface EmailSettingsModel extends EmailSettingsInterface, Document {

}
