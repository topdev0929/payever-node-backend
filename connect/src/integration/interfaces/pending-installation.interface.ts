import { SetupConnectInterface } from './setup-connect.interface';
export interface PendingInstallationInterface {
  businessId: string;
  payload: SetupConnectInterface;
}
