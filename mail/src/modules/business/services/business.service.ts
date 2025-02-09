import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { EventDispatcher } from '@pe/nest-kit';
import { Model } from 'mongoose';
import { BusinessDto } from '../dto';
import { BusinessEmitterEvent } from '../enums';
import { BusinessModel } from '../models';

@Injectable()
export class BusinessService {

  constructor(
    @InjectModel('Business') private readonly businessModel: Model<BusinessModel>,
    private readonly dispatcher: EventDispatcher,
  ) { }

  public async upsert(createBusinessDto: BusinessDto): Promise<BusinessModel> {
    try {
      const set: any = {
        name: createBusinessDto.name,
      };

      return this.businessModel.findOneAndUpdate(
        {
          _id: createBusinessDto._id,
        },
        {
          $set: set,
        },
        {
          new: true,
          setDefaultsOnInsert: true,
          upsert: true,
        },
      );
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

  public async deleteOneById(businessId: string): Promise<void> {
    const business: BusinessModel = await this.businessModel.findOneAndDelete({ _id: businessId });
    if (business) {
      await this.dispatcher.dispatch(BusinessEmitterEvent.BusinessRemoved, business);
    }
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
