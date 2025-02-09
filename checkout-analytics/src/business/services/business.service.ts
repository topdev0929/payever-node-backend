import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { BusinessDto, RemoveBusinessDto } from '../dto';
import { BusinessSchemaName } from '../schemas';
import { BusinessModel } from '../models';

export class BusinessService {
  constructor(
    @InjectModel(BusinessSchemaName) private readonly businessModel: Model<BusinessModel>,
  ) { }

  public async getAll(): Promise<BusinessModel[]> {
    return this.businessModel.find();
  }

  public async remove(dto: RemoveBusinessDto): Promise<void> {
    await this.businessModel.findOneAndDelete({
      _id: dto._id,
    });
  }

  public async upsert(businessDto: BusinessDto): Promise<BusinessModel> {
    return this.businessModel.findOneAndUpdate(
      {
        _id: businessDto._id,
      },
      businessDto,
      {
        new: true,
        setDefaultsOnInsert: true,
        upsert: true,
      },
    );
  }

  public async getById(businessUuid: string): Promise<BusinessModel> {
    return this.businessModel.findOne({
      _id: businessUuid,
    });
  }
}
