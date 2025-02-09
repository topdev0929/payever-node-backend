import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Command } from '@pe/nest-kit/modules/command';
import { Model } from 'mongoose';
import { AppointmentRabbitEventsEnum } from '../enums';
import { AppointmentEventsProducer } from '../producers';
import { AppointmentDocument, AppointmentSchemaName } from '../schemas';

@Injectable()
export class AppointmentsExportCommand {
  constructor(
    @InjectModel(AppointmentSchemaName) private readonly appointmentsModel: Model<AppointmentDocument>,
    private readonly appointmentsEventsProducer: AppointmentEventsProducer,
  ) { }

  @Command({ command: 'appointments:export', describe: 'Export appointments through the bus' })
  public async appointmentsExport(): Promise<void> {
    const count: number = await this.appointmentsModel.countDocuments({ }).exec();
    const limit: number = 100;
    let start: number = 0;
    let appointments: AppointmentDocument[] = [];

    while (start < count) {
      appointments = await this.getWithLimit(start, limit);
      start += limit;

      for (const appointment of appointments) {
        await this.appointmentsEventsProducer.produceAppointmentEvent(
          AppointmentRabbitEventsEnum.export, 
          appointment,
        );
      }
    }
  }

  private async getWithLimit(start: number, limit: number): Promise<AppointmentDocument[]> {
    return this.appointmentsModel.find(
      { },
      null,
      {
        limit: limit,
        skip: start,
        sort: { createdAt: 1 },
      },
    );
  }
}

