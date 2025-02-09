import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { BusinessDto } from '../dto';
import { BusinessModel } from '../interfaces/entities';
import { BusinessSchemaName } from '../schemas';

@Injectable()
export class BusinessService {
  constructor(
    @InjectModel(BusinessSchemaName) private readonly businessModel: Model<BusinessModel>,
  ) { }

  public async create(createBusinessDto: BusinessDto): Promise<BusinessModel> {
    try {
      const business: any = {
        _id: createBusinessDto._id,
        createdAt: createBusinessDto.createdAt,
        name: createBusinessDto.name,
      };

      await this.businessModel.create(business);

      return await this.businessModel.findOne({ _id: createBusinessDto._id });
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  public async findOneById(businessUuid: string): Promise<BusinessModel> {
    try {
      return await this.businessModel.findOne({ _id: businessUuid });
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  public async deleteOneById(businessId: string): Promise<BusinessModel> {
    return this.businessModel.findByIdAndRemove({ _id: businessId });
  }

  public async updateById(businessId: string, data: BusinessDto): Promise<void> {
    const updatedData: any = { };
    Object.keys(data).forEach((key: string) => {
      updatedData[`${key}`] = data[key];
    });

    try {
      await this.businessModel.update(
        { _id: businessId },
        { $set: updatedData },
      );
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }
}
