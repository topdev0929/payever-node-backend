import { SetupTerminalInterface } from './setup-terminal.interface';

export interface PendingInstallationInterface {
  businessId: string;
  payload: SetupTerminalInterface;
}
