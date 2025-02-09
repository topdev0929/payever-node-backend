import { SetupCheckoutInterface } from '..';

export interface PendingInstallationInterface {
  businessId: string;
  payload: SetupCheckoutInterface;
}
