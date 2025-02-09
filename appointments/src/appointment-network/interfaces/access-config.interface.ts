import { BusinessInterface, AppointmentNetworkInterface } from '../interfaces';

export interface AccessConfigInterface {
  isLive: boolean;
  internalDomain: string;
  internalDomainPattern: string;
  isPrivate: boolean;
  ownDomain: string;
  privateMessage: string;
  privatePassword: string;
  socialImage: string;
  isLocked: boolean;
  version?: string;
  business?: BusinessInterface | string;
  businessId: string;
  appointmentNetwork: AppointmentNetworkInterface | string;
}
