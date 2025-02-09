import * as uuid from 'uuid';

import { BaseFixture } from '@pe/cucumber-sdk';
import { Model } from 'mongoose';
import { getModelToken } from '@nestjs/mongoose';

import { appointmentsFactory } from '../factories';
import { DefaultAppointmentFieldsEnum } from '../../src/appointments/enums';
import {
  FieldDocument,
  AppointmentDocument,
  AppointmentFieldDocument,

  Field,
  Appointment,
  AppointmentField,
} from '../../src/appointments/schemas';
import {
  APPOINTMENT_IDS,
  BUSINESS_ID,
  ADMIN_APPOINTMENT_IDS,
  FOLDER_ID,
} from './const';
import { ADMIN_API_BUSINESS_ID } from '../../src/appointments/const';

class AppointmentsFixture extends BaseFixture {
  protected readonly fieldModel: Model<FieldDocument> =
    this.application.get(getModelToken(Field.name));
  protected readonly appointmentFieldModel: Model<AppointmentFieldDocument> =
    this.application.get(getModelToken(AppointmentField.name));

  protected readonly appointmentModel: Model<AppointmentDocument> =
    this.application.get(getModelToken(Appointment.name));
  public async apply(): Promise<void> {

    const emailField: FieldDocument = await this.fieldModel.findOne({
      name: DefaultAppointmentFieldsEnum.Email,
    });

    const firstNameField: FieldDocument = await this.fieldModel.findOne({
      name: 'firstName',
    });

    const lastNameField: FieldDocument = await this.fieldModel.findOne({
      name: 'lastName',
    });

    for (const appointmentId of APPOINTMENT_IDS) {
      const appointment: AppointmentDocument = await this.appointmentModel.create(
        appointmentsFactory({
          businessId: BUSINESS_ID,
          _id: appointmentId,
        }),
      );

      await this.appointmentFieldModel.create({
        appointmentId: appointment._id,
        fieldId: emailField._id,
        _id: uuid.v4(),
        value: `${appointmentId}@email.com`,

      });

      await this.appointmentFieldModel.create({
        appointmentId: appointment._id,
        fieldId: emailField._id,
        _id: uuid.v4(),
        value: `${appointmentId}@email.com`,
      });

      await this.appointmentFieldModel.create({
        appointmentId: appointment._id,
        fieldId: firstNameField._id,
        _id: uuid.v4(),
        value: `${appointmentId} first name`,
      });

      await this.appointmentFieldModel.create({
        appointmentId: appointment._id,
        fieldId: lastNameField._id,
        _id: uuid.v4(),
        value: `${appointmentId} last name`,
      });
    }

    for (const appointmentId of ADMIN_APPOINTMENT_IDS) {
      const adminAppointment: AppointmentDocument = await this.appointmentModel.create(
        appointmentsFactory({
          businessId: ADMIN_API_BUSINESS_ID,
          _id: appointmentId,
        }),
      );

      await this.appointmentFieldModel.create({
        appointmentId: adminAppointment._id,
        fieldId: emailField._id,
        _id: uuid.v4(),
        value: `${appointmentId}@example.com`,
      });
    }
  }
}

export = AppointmentsFixture;
