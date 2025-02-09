import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { AppointmentModel } from '../models';
import { Model } from 'mongoose';
import { AppointmentEventDto } from '../dto';
import { AppointmentSchemaName } from '../schemas';

@Injectable()
export class AppointmentService {
  constructor(
    @InjectModel(AppointmentSchemaName) private readonly appointmentModel: Model<AppointmentModel>,
  ) { }

  public async createOrUpdateAppointmentFromEvent(data: AppointmentEventDto): Promise<AppointmentModel> {

    return this.appointmentModel.findOneAndUpdate(
      { _id: data._id },
      {
        $set: {
          ...data,
        },
      },
      { new: true, upsert: true },
    );
  }

  public async deleteAppointment(data: AppointmentEventDto): Promise<void> {
    await this.appointmentModel.deleteOne({ _id: data._id }).exec();
  }

  public async getAllBusinessAppointment(businessId: string): Promise<AppointmentModel[]> {
    return this.appointmentModel.find({
      businessId,
    });
  }
}
