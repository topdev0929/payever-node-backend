import * as uuid from 'uuid';

import { Injectable } from '@nestjs/common';

import { DefaultAppointmentFieldsEnum } from '../enums';
import { AppointmentFieldDto, NamedAppointmentFieldDto } from '../dto';
import { AppointmentFieldModelService } from '../models-services';
import { AppointmentFieldDocument, AppointmentDocument, FieldDocument } from '../schemas';
import { FieldService } from './field.service';

@Injectable()
export class AppointmentFieldService {
  constructor(
    private readonly appointmentFieldModelService: AppointmentFieldModelService,
    private readonly fieldService: FieldService,
  ) { }

  public async createOrUpdateDefaultField(
    fieldName: DefaultAppointmentFieldsEnum,
    value: string,
    appointment: AppointmentDocument,
  ): Promise<AppointmentFieldDocument> {
    const field: FieldDocument = await this.fieldService.findDefaultByName(fieldName);
    const appointmentField: AppointmentFieldDocument =
      await this.findOneByFieldAndAppointment(field._id, appointment._id);

    return !appointmentField
      ? this.createAppointmentField(field, value, appointment)
      : this.updateAppointmentField(appointmentField, value);
  }

  public async replaceOrGet(
    appointmentId: string,
    fields?: AppointmentFieldDto[],
  ): Promise<AppointmentFieldDocument[]> {
    if (!Array.isArray(fields)) {
      return this.appointmentFieldModelService.find({
        appointmentId,
      });
    }

    return this.replace(appointmentId, fields);
  }

  public async replace(
    appointmentId: string,
    fields: AppointmentFieldDto[],
  ): Promise<AppointmentFieldDocument[]> {
    await this.appointmentFieldModelService.removeByFilter({
      appointmentId: appointmentId,
    });

    return this.create(appointmentId, fields);
  }

  public async create(
    appointmentId: string,
    fields: AppointmentFieldDto[],
  ): Promise<AppointmentFieldDocument[]> {
    return Promise.all(fields.map((field: AppointmentFieldDto) => {
      return this.appointmentFieldModelService.create({
        _id: uuid.v4(),
        appointmentId: appointmentId,
        fieldId: field.fieldId,
        value: field.value,
      });
    }));
  }

  public async createFromNamed(
    appointmentId: string,
    businessId: string,
    fields: NamedAppointmentFieldDto[],
  ): Promise<AppointmentFieldDocument[]> {
    return Promise.all(
      fields
      .filter((fieldPrototype: NamedAppointmentFieldDto) => fieldPrototype.value)
      .map(async (fieldPrototype: NamedAppointmentFieldDto) => {
        const fieldDocument: FieldDocument = await this.fieldService.findOrCreate(
          fieldPrototype.name,
          businessId,
        );

        return this.appointmentFieldModelService.create({
          appointmentId: appointmentId,
          fieldId: fieldDocument._id,
          value: fieldPrototype.value,
        });
      }));
  }

  private async findOneByFieldAndAppointment(
    fieldId: string,
    appointmentId: string,
  ): Promise<AppointmentFieldDocument> {
    return this.appointmentFieldModelService.findOne({
      appointmentId,
      fieldId,
    });
  }

  private createAppointmentField(
    field: FieldDocument,
    value: string,
    appointment: AppointmentDocument,
  ): Promise<AppointmentFieldDocument> {
    return this.appointmentFieldModelService.create({
      _id: uuid.v4(),
      appointmentId: appointment._id,
      fieldId: field._id,
      value: value,
    });
  }

  private async updateAppointmentField(
    appointmentField: AppointmentFieldDocument,
    value: string,
  ): Promise<AppointmentFieldDocument> {
    appointmentField.value = value;
    await this.appointmentFieldModelService.updateById({
      _id: appointmentField._id,
      value,
    });

    return appointmentField;
  }
}
