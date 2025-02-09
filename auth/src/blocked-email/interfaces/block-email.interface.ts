import { EmailTypeEnum } from '../enums/email-type.enum';

export interface BlockEmailInterface {
  type: EmailTypeEnum;
  value: string;
}
