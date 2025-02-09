import { AppointmentNetworkInterface } from './appointment-network.interface';

export interface DomainInterface {
  name: string;
  isConnected?: boolean;
  appointmentNetwork: AppointmentNetworkInterface | string;
}
