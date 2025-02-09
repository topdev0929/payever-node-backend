import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, UpdateWriteOpResult } from 'mongoose';
import { BusinessSchemaName } from '../schemas';
import { BusinessDto } from '../dto';
import { BusinessModel } from '../models';
import { BusinessEventsEnums } from '../enums';
import { EventDispatcher } from '@pe/nest-kit';

@Injectable()
export class BusinessService {
  constructor(
    @InjectModel(BusinessSchemaName) private readonly businessModel: Model<BusinessModel>,
    private readonly eventDispatcher: EventDispatcher,
  ) { }

  public async createOrUpdate(dto: BusinessDto): Promise<void> {
    const existing: BusinessModel = await this.findOneById(dto._id);

    await (!existing
      ? this.create(dto)
      : this.updateById(dto._id, dto));
  }

  public async create(dto: BusinessDto): Promise<BusinessModel> {
    const business: BusinessModel = await this.businessModel.create(dto);
    if (business) {
      await this.eventDispatcher.dispatch(BusinessEventsEnums.BusinessCreated, dto);
    }

    return business;
  }

  public async findOneById(businessUuid: string): Promise<BusinessModel> {
    return this.businessModel.findOne({ _id: businessUuid });
  }

  public async findAll(): Promise<BusinessModel[]> {
    return this.businessModel.find();
  }

  public async deleteOneById(businessId: string): Promise<void> {
    await this.businessModel.findByIdAndRemove({ _id: businessId }).exec();
  }

  public async updateById(businessId: string, dto: BusinessDto): Promise<UpdateWriteOpResult> {

    return this.businessModel.update(
      { _id: businessId },
      {
        $set: {
          createdAt: dto.createdAt,
          name: dto.name,
        },
      },
    );
  }
}
