import * as uuid from 'uuid';
import { BaseFixture } from '@pe/cucumber-sdk/module';
import { getModelToken } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { BusinessModel, BusinessSchemaName } from '@pe/business-kit';
import { AccessConfigModel } from '../../src/appointment-network/models';
import { AppointmentNetworkFactory, appointmentsFactory } from '../factories';
import { Appointment, AppointmentDocument, AppointmentField, AppointmentFieldDocument, Field, FieldDocument } from '../../src/appointments/schemas';
import { APPOINTMENT_IDS } from './const';

const BUSINESS_ID: string = 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb';

class AdminAppointmentFixture extends BaseFixture {
  private readonly businessModel: Model<BusinessModel> = this.application.get(getModelToken(BusinessSchemaName));
  private readonly accessConfigModel: Model<AccessConfigModel> 
  = this.application.get('AccessConfigModel');
  protected readonly fieldModel: Model<FieldDocument> =
    this.application.get(getModelToken(Field.name));
  protected readonly appointmentFieldModel: Model<AppointmentFieldDocument> =
    this.application.get(getModelToken(AppointmentField.name));
  protected readonly appointmentModel: Model<AppointmentDocument> =
    this.application.get(getModelToken(Appointment.name));
    

  public async apply(): Promise<void> {
    await this.businessModel.create({
      _id: BUSINESS_ID,
      name: 'Test business',      
    } as any);

    for (const appointmentId of APPOINTMENT_IDS) {
      const appointment: AppointmentDocument = await this.appointmentModel.create(
        appointmentsFactory({
          _id: appointmentId,
          businessId: BUSINESS_ID,
          note:'note',
          contacts: [],
          products: [
            "p1",
            "p2"
          ],
          allDay: true,
          repeat: true,
          date: "09/12/2021",
          time: "13:10",
          location: "LA",
        }),
      );
    }
  }
}

export = AdminAppointmentFixture;



