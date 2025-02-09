import { Injectable } from '@nestjs/common';
import { EventDispatcher, RedisClient } from '@pe/nest-kit';
import { FilterQuery } from 'mongoose';

import { AppointmentInternalEventsEnum, MeasuringEnum } from '../enums';
import { AppointmentFieldService } from './appointment-field.service';
import { AppointmentDocument, AppointmentFieldDocument, FieldDocument } from '../schemas';
import { AppointmentFieldModelService, AppointmentModelService } from '../models-services';
import { AppointmentFieldDto, AppointmentQueryDto, CreateAppointmentDto, BuilderIntegrationDto } from '../dto';
import { CreateContactsRequestProducer } from '../producers/create-contacts-request.producer';
import { FieldService } from './field.service';
import { ElasticExtraData } from '../interfaces';

@Injectable()
export class AppointmentService {
  constructor(
      private readonly appointmentFieldService: AppointmentFieldService,
      private readonly appointmentModelService: AppointmentModelService,
      private readonly appointmentFieldModelService: AppointmentFieldModelService,
      protected readonly eventDispatcher: EventDispatcher,
      private readonly createContactsRequestProducer: CreateContactsRequestProducer,
      private readonly fieldService: FieldService,
      private readonly redisClient: RedisClient,
  ) { }

  public async findById(id: string): Promise<AppointmentDocument> {
    return this.appointmentModelService.findById(id);
  }

  public async getForAdmin(query: AppointmentQueryDto)
      : Promise<{ documents: AppointmentDocument[]; page: number; total: number }> {

    const limit: number = query.limit || 100;
    const page: number = query.page || 1;
    const sort: any = query.sort || { createdAt: 1 };
    const skip: number = (page - 1) * limit;

    const conditions: any = { };


    if (query.businessIds) {
      conditions.businessId = { $in: Array.isArray(query.businessIds) ? query.businessIds : [query.businessIds] };
    }

    const documents: AppointmentDocument[] = await this.appointmentModelService
        .find(conditions)
        .select(query.projection)
        .sort(sort)
        .skip(skip)
        .limit(limit)
        .exec();

    const total: number = await this.appointmentModelService.count(conditions);

    return {
      documents,
      page,
      total,
    };
  }

  public async createForBuilder(
    dto: BuilderIntegrationDto,
    extraData: ElasticExtraData,
  ):
  Promise<AppointmentDocument> {
    const businessId: string = dto.businessId;
    await this.createContactsRequestProducer.request(dto.data.contact, businessId);
    delete dto.data.contact;
    delete dto.businessId;

    const fields: AppointmentFieldDto[] = [];

    for (const fieldName in dto.data.fields) {
      if (dto.data.fields.hasOwnProperty(fieldName)) {
        const field: FieldDocument = await this.fieldService.findOrCreate(fieldName, businessId);
        fields.push(
            {
              fieldId: field._id,
              value: dto.data.fields[fieldName],
            },
        );
      }
    }

    await this.redisClient.deleteAllByPattern(`integration|data|appointment|${businessId}`);
    await this.fieldService.findForBusiness(businessId);

    delete dto.data.fields;

    const appointmentDto: CreateAppointmentDto = {
      allDay: false,
      fields: fields,
      repeat: false,
      ...dto.data,
    };

    return this.create({
      ...appointmentDto,
      businessId,
    }, extraData);
  }

  public async create(
      data: {
        businessId: string;
        allDay: boolean;
        repeat: boolean;
        date?: string;
        time?: string;
        location?: string;
        note?: string;
        products?: string[];
        fields?: AppointmentFieldDto[];
        appointmentNetwork: string;
        duration?: number;
        measuring?: MeasuringEnum;
      },
      extraData?: ElasticExtraData,
  ): Promise<AppointmentDocument> {
    const newAppointment: AppointmentDocument = await this.appointmentModelService.create({
      ...data,
      fields: undefined,
    });

    const appointmentFields: AppointmentFieldDocument[] =
        await this.appointmentFieldService.create(newAppointment._id, data.fields || []);

    await this.eventDispatcher.dispatch(
        AppointmentInternalEventsEnum.AppointmentAndFieldsCreated,
        newAppointment,
        appointmentFields,
        extraData,
    );

    return newAppointment;
  }

  public async updateOneByFilter(filter: FilterQuery<AppointmentDocument>, data: {
    allDay?: boolean;
    repeat?: boolean;
    date?: string;
    time?: string;
    location?: string;
    note?: string;
    products?: string[];
    contacts?: string[];
    fields?: AppointmentFieldDto[];
    appointmentNetwork?: string;
    duration?: number;
    measuring?: MeasuringEnum;
  }): Promise<AppointmentDocument> {
    const appointment: AppointmentDocument = await this.appointmentModelService.findOne(filter);

    if (!appointment) {
      throw new Error(`Appointment by filter "${JSON.stringify(filter)}" not found`);
    }

    return this.updateAppointment(appointment, data);
  }

  public async updateById(_id: string, data: {
    allDay?: boolean;
    repeat?: boolean;
    date?: string;
    time?: string;
    location?: string;
    note?: string;
    products?: string[];
    contacts?: string[];
    fields?: AppointmentFieldDto[];
    appointmentNetwork?: string;
    duration?: number;
    measuring?: MeasuringEnum;
  }): Promise<AppointmentDocument> {
    const appointment: AppointmentDocument = await this.appointmentModelService.findById(_id);

    if (!appointment) {
      throw new Error(`Appointment "${_id}" not found`);
    }

    return this.updateAppointment(appointment, data);
  }

  public async updateAppointment(appointment: AppointmentDocument, data: {
    allDay?: boolean;
    repeat?: boolean;
    date?: string;
    time?: string;
    location?: string;
    note?: string;
    products?: string[];
    contacts?: string[];
    fields?: AppointmentFieldDto[];
    appointmentNetwork?: string;
    duration?: number;
    measuring?: MeasuringEnum;
  }): Promise<AppointmentDocument> {

    appointment = await this.appointmentModelService.updateById({
      ...data,
      _id: appointment._id,
      fields: undefined,
    });

    const appointmentFields: AppointmentFieldDocument[] =
        await this.appointmentFieldService.replaceOrGet(appointment._id, data.fields);

    await this.eventDispatcher.dispatch(
        AppointmentInternalEventsEnum.AppointmentAndFieldsUpdated,
        appointment,
        appointmentFields,
    );

    return appointment;
  }

  public async delete(appointment: AppointmentDocument): Promise<void> {
    await this.appointmentFieldModelService.removeByFilter({
      appointmentId: appointment.id,
    });
    await this.appointmentModelService.removeById(appointment._id);
    await this.eventDispatcher.dispatch(AppointmentInternalEventsEnum.AppointmentAndFieldsDeleted, appointment, []);
  }
}
