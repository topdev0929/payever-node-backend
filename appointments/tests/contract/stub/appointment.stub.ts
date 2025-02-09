import { AppointmentDurationUnitsEnum } from 'src/appointment-types';
import { MeasuringEnum } from '../../../src/appointments/enums';
import { Appointment } from '../../../src/appointments/schemas';
import * as uuid from 'uuid';
import { AppointmentFieldMocked } from './appointment-field.stub';
const id = uuid.v4();
export const AppointmentMocked: Appointment = {
  id: '1',
  businessId: '1',
  fields: [AppointmentFieldMocked],
  appointmentNetwork: 'some-appointment-network',
  duration: 1,
  measuring: MeasuringEnum.hour,
  allDay: false,
  repeat: false,
};
