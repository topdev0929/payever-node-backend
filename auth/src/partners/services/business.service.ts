import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { EventDispatcher } from '@pe/nest-kit';
import { Model } from 'mongoose';

import { PartnerTagEventsEnum } from '../enum';
import { PartnerTagInterface } from '../interfaces';
import { BusinessTagDto } from '../dto';
import { PartnerBusinessSchemaName } from '../schemas';

@Injectable()
export class BusinessService {
  constructor(
    @InjectModel(PartnerBusinessSchemaName) private readonly businessModel: Model<PartnerTagInterface>,
    private readonly eventDispatcher: EventDispatcher,
  ) { }

  public async assignTag(dto: BusinessTagDto): Promise<void> {
    const partnerTag: PartnerTagInterface = await this.businessModel.findOneAndUpdate(
      { _id: dto.businessId},
      { $addToSet: { partnerTags: dto.tagName } as never},
      { upsert: true, new: true },
    ).exec();
    await this.eventDispatcher.dispatch(PartnerTagEventsEnum.added, partnerTag);
  }

  public async removeTag(dto: BusinessTagDto): Promise<void> {
    await this.businessModel.findByIdAndUpdate(
      dto.businessId,
      { $pull: { partnerTags: dto.tagName } as never },
      { upsert: true },
    ).exec();
    await this.eventDispatcher.dispatch(PartnerTagEventsEnum.removed, dto);
  }
}
