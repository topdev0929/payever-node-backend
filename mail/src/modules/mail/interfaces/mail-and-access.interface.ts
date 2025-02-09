import { MailAccessConfigModel, MailModel } from '../models';

export interface MailAndAccessInterface {
  mail: MailModel;
  access: MailAccessConfigModel;
}
