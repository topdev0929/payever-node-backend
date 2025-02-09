import { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { EventDispatcher } from '@pe/nest-kit';

import {
  Appointment,
  AppointmentDocument,
} from '../schemas';
import { BaseModelService } from '../../common';

@Injectable()
export class AppointmentModelService extends BaseModelService<AppointmentDocument> {
  constructor(
    @InjectModel(Appointment.name)
      readonly appointmentModel: Model<AppointmentDocument>,
    readonly eventDispatcher: EventDispatcher,
  ) {
    super(appointmentModel, eventDispatcher);
  }
}
