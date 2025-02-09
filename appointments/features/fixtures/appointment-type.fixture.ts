import { AppointmentTypeDocument } from '../../src/appointment-types';
import { appointmentTypeFactory } from '../factories/appointment-type.factory';
import { Base } from './base.fixture';

const APPOINTMENT_TYPE_ID: string = '11111111-1111-1111-1111-111111111111';
const APPOINTMENT_TYPE_ID_2: string = '11111111-1111-1111-1111-111111111112';
const BUSINESS_ID: string = 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb';

class AppointmentsTypeFixture extends Base {

  public async apply(): Promise<void> {
    await super.apply();

    await this.appointmentTypeModel.create(
      appointmentTypeFactory({
        businessId: BUSINESS_ID,
        _id: APPOINTMENT_TYPE_ID,
      }),
    );

    await this.appointmentTypeModel.create(
      appointmentTypeFactory({
        businessId: BUSINESS_ID,
        _id: APPOINTMENT_TYPE_ID_2,
        isDefault: true,
      }),
    );
  }
}

export = AppointmentsTypeFixture;
