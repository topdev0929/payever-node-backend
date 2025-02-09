import { MailServerConfigInterface } from '../interfaces';
import { Document } from 'mongoose';

export interface MailServerConfigModel extends MailServerConfigInterface, Document { }
