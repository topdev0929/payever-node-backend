import { MappedFolderItemInterface } from '@pe/folders-plugin';
import { PopulateOptions } from 'mongoose';
import type { Populated } from 'src/common';
import { AppointmentDocument } from '../schemas';

export const appointmentToESDocumentPopulateArgument: PopulateOptions[] = [{
  path: 'fields',
  populate: {
    path: 'field',
  },
}];

export function mapPopulatedAppointmentToFolderItemPrototype(
  appointment: Populated<AppointmentDocument, 'fields'>,
): MappedFolderItemInterface {
  const prototype: MappedFolderItemInterface = {
    _id: appointment._id,
    allDay: appointment.allDay,
    applicationId: appointment.appointmentNetwork,
    appointmentNetwork: appointment.appointmentNetwork,
    businessId: appointment.businessId,
    date: appointment.date,
    location: appointment.location,
    note: appointment.note,
    repeat: appointment.repeat,
    serviceEntityId: appointment._id,
    time: appointment.time,

    createdAt: appointment.createdAt,
    updatedAt: appointment.updatedAt,

    title: `${appointment.date} ${appointment.time}`,
    userId: null,
  };

  for (const field of appointment.fields) {
    if (field.field) {
      prototype[field.field.name] = field.value;
    }
  }

  prototype.name = prototype.title;

  return prototype;
}

export async function appointmentToESDocument(appointment: AppointmentDocument): Promise<MappedFolderItemInterface> {
  await appointment.populate(appointmentToESDocumentPopulateArgument).execPopulate();

  return mapPopulatedAppointmentToFolderItemPrototype(appointment as Populated<AppointmentDocument, 'fields'>);
}
