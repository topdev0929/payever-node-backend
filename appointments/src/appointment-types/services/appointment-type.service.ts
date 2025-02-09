import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, FilterQuery } from 'mongoose';

import { EventDispatcher } from '@pe/nest-kit';
import { BaseModelService, ListQueryDto } from '../../common';
import { AppointmentTypeDocument, AppointmentTypeSchemaName } from '../schemas';
import { AppointmentTypeEventsEnum } from '../enums';
import { TypePagingResultDto } from '../dto';
import { FilterService } from '../../filters';
@Injectable()
export class AppointmentTypeService extends BaseModelService<AppointmentTypeDocument> {
  constructor(
    @InjectModel(AppointmentTypeSchemaName)
      readonly appointmentTypeModel: Model<AppointmentTypeDocument>,
    readonly eventDispatcher: EventDispatcher,
  ) {
    super(
      appointmentTypeModel, 
      eventDispatcher,
      {
        created: AppointmentTypeEventsEnum.created,
        deleted: AppointmentTypeEventsEnum.deleted, 
        updated: AppointmentTypeEventsEnum.updated,
      });
  }

  public async search(listQueryDto: ListQueryDto, businessId: string): Promise<TypePagingResultDto> {
    const { page, limit }: any = listQueryDto;
    const sort: any = { };

    sort[listQueryDto.orderBy] = listQueryDto.direction === 'asc' ? 1 : -1;

    const filters: Array<FilterQuery<AppointmentTypeDocument>> = [];

    const inputFilters: any = JSON.parse(listQueryDto.filters || '{}');

    FilterService.addFilters(filters, inputFilters);

    const appointmentTypes: AppointmentTypeDocument[] = await this.appointmentTypeModel.find(
      filters.length ? { businessId, $or: filters } : { businessId },
      null,
      {
        limit: limit,
        skip: (page - 1) * limit,
        sort,
      },
    );

    const total: number = await this.appointmentTypeModel.count({ businessId });

    return {
      collection: appointmentTypes,
      pagination_data: {
        page,
        total,
      },
    };
  }
}
