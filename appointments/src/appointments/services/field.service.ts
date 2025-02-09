import { Injectable } from '@nestjs/common';
import { DocumentDefinition } from 'mongoose';

import { BusinessModel } from '@pe/business-kit';
import { FieldDocument } from '../schemas';
import { FieldModelService } from '../models-services';
import { DefaultAppointmentFieldsEnum } from '../enums';
import { RedisClient } from '@pe/nest-kit';

@Injectable()
export class FieldService {
  constructor(
    private readonly fieldModelService: FieldModelService,
    private readonly redisClient: RedisClient,
  ) { }

  public async findForBusiness(businessId: string, appointmentId?: string): Promise<FieldDocument[]> {
    const data: FieldDocument[] = await this.fieldModelService.find({
      appointmentId: {
        $in: [null, appointmentId],
      },
      businessId: {
        $in: [null, businessId],
      },
    });

    await this.redisClient.set(`appointment|field|${businessId}`, JSON.stringify(data));

    return data;
  }

  public async findByName(name: string, businessId: string): Promise<FieldDocument> {
    return this.fieldModelService.findOne({
      businessId: {
        $in: [null, businessId],
      },
      name,
    });
  }

  public async findDefaultByName(name: string): Promise<FieldDocument> {
    return this.findByName(name, null);
  }

  public async findOrCreate(name: string, businessId: string): Promise<FieldDocument> {
    return this.fieldModelService.findOrCreate({
      businessId: {
        $in: [null, businessId],
      },
      name,
    }, {
      businessId,
      editableByAdmin: false,
      name,
      showDefault: true,
      title: name,
      type: 'text',
    });
  }

  public async createFromDto(dto: DocumentDefinition<FieldDocument>): Promise<FieldDocument> {
    return this.fieldModelService.create({
      appointmentId: dto.appointmentId,
      businessId: dto.businessId,
      defaultValues: dto.defaultValues,
      editableByAdmin: dto.editableByAdmin,
      filterable: dto.filterable,
      name: dto.name,
      showDefault: dto.showDefault,
      title: dto.title,
      type: dto.type,
    });
  }

  public async createOrUpdateFromBusiness(business: BusinessModel): Promise<void> {
    const fieldDtos: Array<DocumentDefinition<FieldDocument>> = await this.createDefaultFieldsDto(business);

    for (const fieldDto of fieldDtos) {
      await this.createOrUpdateDefaultField(fieldDto);
    }
  }

  public async createOrUpdateDefaultField(fieldDto: DocumentDefinition<FieldDocument>): Promise<FieldDocument> {
    let field: FieldDocument = await this.fieldModelService.findOne({
      businessId: fieldDto.businessId,
      name: fieldDto.name,
    });

    if (!field) {
      field = await this.createFromDto(fieldDto);
    }

    return field;
  }

  public async deleteForBusiness(businessId: string): Promise<void> {
    await this.fieldModelService.removeByFilter({
      businessId,
    });
  }

  private async createDefaultFieldsDto(business: BusinessModel): Promise<any> {
    const fieldDtos: Array<DocumentDefinition<FieldDocument>> = [];

    fieldDtos.push({
      businessId: business._id,
      editableByAdmin: true,
      name: DefaultAppointmentFieldsEnum.Name,
      title: 'Name',
      type: 'text',
    });
    fieldDtos.push({
      businessId: business._id,
      editableByAdmin: true,
      name: DefaultAppointmentFieldsEnum.Phone,
      title: 'Phone',
      type: 'text',
    });
    fieldDtos.push({
      businessId: business._id,
      editableByAdmin: true,
      name: DefaultAppointmentFieldsEnum.Email,
      title: 'Email',
      type: 'text',
    });

    return fieldDtos;
  }
}
