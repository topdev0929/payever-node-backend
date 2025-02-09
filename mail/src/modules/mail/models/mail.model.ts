import { Document } from 'mongoose';
import { MailInterface } from '../interfaces';
import { BusinessModel } from '../../business';

export interface MailModel extends MailInterface, Document {
  business?: BusinessModel;
}
