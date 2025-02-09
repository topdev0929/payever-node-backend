import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { BusinessMediaDto, BusinessMediaReferenceDto } from '../dto';
import { BusinessMediaModel } from '../models';
import { Model } from 'mongoose';
import { BusinessMediaSchemaName } from '../schemas';
import { BusinessModel } from '../../../business/models';

const SHOW_LAST_MEDIA: number = 4;

@Injectable()
export class BusinessMediaService {
  constructor(
    @InjectModel(BusinessMediaSchemaName) private readonly businessMediaModel: Model<BusinessMediaModel>,
  ) { }

  public async createOrUpdate(data: BusinessMediaDto): Promise<BusinessMediaModel> {
    return this.businessMediaModel.findOneAndUpdate(
      { _id: data.id },
      {
        $set: {
          businessId: data.business.id,
          mediaType: data.mediaType,
          name: data.name,
          url: data.url,
        },
      },
      { new: true, upsert: true },
    );
  }

  public async getMediaList(business: BusinessModel): Promise<BusinessMediaModel[]> {
    return this.findLastMedia(business.id);
  }

  public async delete(data: BusinessMediaReferenceDto): Promise<void> {
    await this.businessMediaModel.deleteOne({ _id: data.id }).exec();
  }

  private async findLastMedia(businessId: string): Promise<BusinessMediaModel[]> {
    const mediasCount: number = await this.businessMediaModel
      .count({
        businessId: businessId,
      }).exec();

    if (mediasCount === 0) {
      return [];
    }

    const now: number = Date.now();
    const fullDaysSinceEpoch: number = Math.floor(now / 8.64e7);
    const randomMediaIndex: number = fullDaysSinceEpoch >= mediasCount ?
      fullDaysSinceEpoch % mediasCount
      : mediasCount % fullDaysSinceEpoch;

    return this.businessMediaModel
      .find({
        businessId: businessId,
      })
      .skip(randomMediaIndex)
      .limit(1);
  }
}
