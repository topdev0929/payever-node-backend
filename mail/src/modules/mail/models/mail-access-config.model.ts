import { Document } from 'mongoose';
import { MailAccessConfigInterface } from '../interfaces';
import { MailModel } from '../models';

export interface MailAccessConfigModel extends MailAccessConfigInterface, Document {
  mail: MailModel;
}

