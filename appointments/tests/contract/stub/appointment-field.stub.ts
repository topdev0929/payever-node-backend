import { AppointmentField } from '../../../src/appointments/schemas';
import * as uuid from 'uuid';
const id = uuid.v4();
export const AppointmentFieldMocked: AppointmentField = {
    appointmentId: '1',
    fieldId: '1',
    value: 'some value',
};
