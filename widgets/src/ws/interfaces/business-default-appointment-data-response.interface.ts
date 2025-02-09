import { AppointmentModel } from '../../apps/appointment-app';
import { MessageResponseInterface } from './message-response.interface';

export interface BusinessDefaultAppointmentDataResponseInterface extends MessageResponseInterface {
  id: string;
  appointments?: AppointmentModel[];
}
