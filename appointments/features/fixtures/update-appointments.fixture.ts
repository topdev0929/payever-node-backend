import { appointmentsFactory } from '../factories';
import { DefaultAppointmentFieldsEnum } from '../../src/appointments/enums';
import * as uuid from 'uuid';
import { Base } from './base.fixture';
import { AppointmentDocument, FieldDocument } from '../../src/appointments/schemas';

const APPOINTMENT_ID: string = '11111111-1111-1111-1111-111111111111';
const BUSINESS_ID: string = 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb';

class UpdateAppointmentsFixture extends Base {

  public async apply(): Promise<void> {
    await super.apply();

    const appointment: AppointmentDocument = await this.appointmentModel.create(
      appointmentsFactory({
        businessId: BUSINESS_ID,
        _id: APPOINTMENT_ID,
      }),
    );

    const emailField: FieldDocument = await this.fieldModel.findOne({
      name: DefaultAppointmentFieldsEnum.Email,
    });

    await this.appointmentFieldModel.create({
      appointmentId: appointment._id,
      fieldId: emailField._id,
      _id: uuid.v4(),
      value: `test-existing@email.com`,
    });
  }
}

export = UpdateAppointmentsFixture;
