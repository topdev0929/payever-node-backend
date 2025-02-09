import { MessageResponseInterface } from './message-response.interface';

export interface FailedConnectResponseInterface extends MessageResponseInterface {
  result: false;
}
