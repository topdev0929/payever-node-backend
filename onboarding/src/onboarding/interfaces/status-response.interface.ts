import { MessageResponseInterface } from './message-response.interface';
import { TaskFormatterResultInterface } from './task-formatter-result.interface';

export interface StatusResponseInterface extends MessageResponseInterface {
  task?: TaskFormatterResultInterface;
  user?: string;
}
