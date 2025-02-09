import { MessageResponseInterface } from './message-response.interface';

export interface BusinessDefaultPosTerminalDataResponseInterface extends MessageResponseInterface {
  id: string;
  terminalId?: string;
  terminalName?: string;
  terminalLogo?: string;
}
