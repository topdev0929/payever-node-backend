import { AppointmentAvailabilityDocument } from '../../src/appointment-availability';
import { appointmentAvailabilityFactory } from '../factories/appointment-availability.factory';
import { Base } from './base.fixture';

const APPOINTMENT_AVAILABILITY_ID: string = '11111111-1111-1111-1111-111111111111';
const APPOINTMENT_AVAILABILITY_ID_2: string = '11111111-1111-1111-1111-111111111112';
const BUSINESS_ID: string = 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb';

class AppointmentAvailabilityFixture extends Base {

  public async apply(): Promise<void> {
    await super.apply();

    await this.appointmentAvailabilityModel.create(
      appointmentAvailabilityFactory({
        businessId: BUSINESS_ID,
        _id: APPOINTMENT_AVAILABILITY_ID,
      }),
    );

    await this.appointmentAvailabilityModel.create(
      appointmentAvailabilityFactory({
        businessId: BUSINESS_ID,
        _id: APPOINTMENT_AVAILABILITY_ID_2,
        isDefault: true,
      }),
    );
  }
}

export = AppointmentAvailabilityFixture;
