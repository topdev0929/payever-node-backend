import { Appointment, AppointmentDocument } from '../schemas';

export function appointmentToRmqTransformer(
  appointment: AppointmentDocument,
): {
  appType: 'appointments';
  business: {
    id: string;
  };
  appointment: Appointment;
  id: string;
} {
  return {
    appType: 'appointments',
    business: {
      id: appointment.businessId,
    },

    appointment: appointment.toJSON?.() || appointment,
    id: appointment._id,
  };
}
