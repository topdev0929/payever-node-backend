import { MailInterface } from '../interfaces';

export class MailDto implements MailInterface {
  public businessId: string;
  public name: string;
}
