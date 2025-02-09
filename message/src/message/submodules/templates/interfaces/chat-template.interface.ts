import { MessagingTypeEnum } from '@pe/message-kit';
import { ChatAppEnum } from '../../../enums';

export interface ChatTemplateInterface {
  app?: ChatAppEnum;
  description?: string;
  title: string;
  type: MessagingTypeEnum;
}
