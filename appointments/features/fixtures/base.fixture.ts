import { BaseFixture } from '@pe/cucumber-sdk';
import { getModelToken } from '@nestjs/mongoose';

import { Model } from 'mongoose';
import { BusinessModel, BusinessSchemaName } from '@pe/business-kit';

import {
  AppointmentDocument,
  FieldDocument,
  AppointmentFieldDocument,

  Appointment,
  Field,
  AppointmentField,
} from '../../src/appointments/schemas';
import {
  AppointmentTypeDocument,
  AppointmentType
} from '../../src/appointment-types';
import {
  AppointmentAvailabilityDocument,
  AppointmentAvailability,
} from '../../src/appointment-availability';
import { exampleFieldsFixture } from './data/example-fields.data';

export class Base extends BaseFixture {
  protected readonly businessModel: Model<BusinessModel> =
    this.application.get(getModelToken(BusinessSchemaName));

  protected readonly appointmentModel: Model<AppointmentDocument> =
    this.application.get(getModelToken(Appointment.name));
  protected readonly appointmentTypeModel: Model<AppointmentTypeDocument> =
    this.application.get(getModelToken(AppointmentType.name));
  protected readonly appointmentAvailabilityModel: Model<AppointmentAvailabilityDocument> =
    this.application.get(getModelToken(AppointmentAvailability.name));
  protected readonly fieldModel: Model<FieldDocument> =
    this.application.get(getModelToken(Field.name));
  protected readonly appointmentFieldModel: Model<AppointmentFieldDocument> =
    this.application.get(getModelToken(AppointmentField.name));
  // protected readonly queryModel: Model<QueryDocument> =
  //   this.application.get(getModelToken(Query.name));
  // protected readonly queryLinkModel: Model<QueryLinkDocument> =
  //   this.application.get(getModelToken(QueryLink.name));

  public async apply(): Promise<void> {
    await this.fieldModel.create(exampleFieldsFixture);
  }
}
