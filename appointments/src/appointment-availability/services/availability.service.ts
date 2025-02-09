import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, FilterQuery } from 'mongoose';

import { EventDispatcher } from '@pe/nest-kit';
import { BaseModelService, ListQueryDto } from '../../common';
import { 
  AppointmentAvailability, 
  AppointmentAvailabilityDocument, 
  AppointmentAvailabilitySchemaName, 
} from '../schemas';
import { AppointmentAvailabilityEventsEnum, TimeZones, WeekdayEnum } from '../enums';
import { AvailabilityPagingResultDto } from '../dto';
import { FilterService } from '../../filters';
import { BusinessModel } from '@pe/business-kit';


@Injectable()
export class AppointmentAvailabilityService extends BaseModelService<AppointmentAvailabilityDocument> {
  constructor(
    @InjectModel(AppointmentAvailabilitySchemaName)
      readonly appointmentAvailabilityModel: Model<AppointmentAvailabilityDocument>,
    readonly eventDispatcher: EventDispatcher,
  ) {
    super(
      appointmentAvailabilityModel, 
      eventDispatcher,
      {
        created: AppointmentAvailabilityEventsEnum.created,
        deleted: AppointmentAvailabilityEventsEnum.deleted, 
        updated: AppointmentAvailabilityEventsEnum.updated,
      });
  }

  public async createDefault(business: BusinessModel): Promise<AppointmentAvailabilityDocument> {

    const DEFAULT_AVAILABILITY: AppointmentAvailability = {
      businessId: business._id,
      isDefault: true,
      name: 'default',
      timeZone: TimeZones.GMT,
      weekDayAvailability: [
        {
          isEnabled: true,
          name: WeekdayEnum.Monday,
          ranges: [
            {
              from: '08:00',
              to: '17:00',
            },
          ],
        },
        {
          isEnabled: true,
          name: WeekdayEnum.Tuesday,
          ranges: [
            {
              from: '08:00',
              to: '17:00',
            },
          ],
        },
        {
          isEnabled: true,
          name: WeekdayEnum.Wednesday,
          ranges: [
            {
              from: '08:00',
              to: '17:00',
            },
          ],
        },
        {
          isEnabled: true,
          name: WeekdayEnum.Thursday,
          ranges: [
            {
              from: '08:00',
              to: '17:00',
            },
          ],
        },
        {
          isEnabled: true,
          name: WeekdayEnum.Friday,
          ranges: [
            {
              from: '08:00',
              to: '17:00',
            },
          ],
        },
      ],
    };

    return this.appointmentAvailabilityModel.findOneAndUpdate(
      { name: 'default', businessId: business._id }, 
      { $set: DEFAULT_AVAILABILITY },
      { upsert: true, new: true },
    );
  }

  public async search(listQueryDto: ListQueryDto, businessId: string): Promise<AvailabilityPagingResultDto> {
    const { page, limit }: any = listQueryDto;
    const sort: any = { };

    sort[listQueryDto.orderBy] = listQueryDto.direction === 'asc' ? 1 : -1;

    const filters: Array<FilterQuery<AppointmentAvailabilityDocument>> = [];

    const inputFilters: any = JSON.parse(listQueryDto.filters || '{}');

    FilterService.addFilters(filters, inputFilters);

    const appointmentAvailabilities: AppointmentAvailabilityDocument[] = await this.appointmentAvailabilityModel.find(
      filters.length ? { businessId, $or: filters } : { businessId },
      null,
      {
        limit: limit,
        skip: (page - 1) * limit,
        sort,
      },
    );

    const total: number = await this.appointmentAvailabilityModel.count({ businessId });

    return {
      collection: appointmentAvailabilities,
      pagination_data: {
        page,
        total,
      },
    };
  }


  public async setDefault(
    businessId: string,
    appointmentDocumentId?: string,
  ): Promise<void> {
    // if appointmentDocumentId is not defined then
    // we set first item as default appointment availability if no default not exist
    if (!appointmentDocumentId) {
      const existingDefaultAppointment: AppointmentAvailabilityDocument =
        await this.appointmentAvailabilityModel.findOne({
          businessId,
          isDefault: true,
        });

      if (existingDefaultAppointment) {
        await this.appointmentAvailabilityModel.updateMany(
          {
            _id: { $ne: existingDefaultAppointment.id },
            businessId,
          },
          { $set: { isDefault: false } });

        return;
      }

      // set first item as default
      await this.appointmentAvailabilityModel.updateOne(
        { businessId },
        { $set: { isDefault: true } },
        { new: false },
      );

      return;
    }

    await this.appointmentAvailabilityModel.updateMany(
      {
        _id: { $ne: appointmentDocumentId },
        businessId,
      },
      { $set: { isDefault: false } },
    );

    await this.appointmentAvailabilityModel.findByIdAndUpdate(
      appointmentDocumentId,
      { $set: { isDefault: true } },
      { new: false },
    );
  }
}
