import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { EventDispatcher } from '@pe/nest-kit';
import { AppointmentField, AppointmentFieldDocument } from '../schemas';
import { BaseModelService } from '../../common';

@Injectable()
export class AppointmentFieldModelService extends BaseModelService<AppointmentFieldDocument> {
  constructor(
    @InjectModel(AppointmentField.name)
      readonly appointmentFieldModel: Model<AppointmentFieldDocument>,
    readonly eventDispatcher: EventDispatcher,
  ) {
    super(appointmentFieldModel, eventDispatcher);
  }
}
