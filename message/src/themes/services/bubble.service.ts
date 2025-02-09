import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { BusinessLocalDocument as BusinessModel } from '../../projections/models';
import { UpdateBubbleDto } from '../dto';
import { BubbleModel } from '../models';
import { BubbleSchemaName } from '../schemas';
import { defaultBubble } from '../themes.constant';

@Injectable()
export class BubbleService {
  constructor(
    @InjectModel(BubbleSchemaName)
      private readonly bubbleModel: Model<BubbleModel>,
  ) { }

  public async findOneByBusiness(
    businessId: string,
  ): Promise<BubbleModel> {
    let bubble: BubbleModel = await this.bubbleModel.findOne({
      businessId: businessId,
    }).exec();

    if (!bubble) {
      bubble = await this.createDefault(businessId);
    }

    return bubble;
  }

  public async update(
    business: BusinessModel,
    dto: UpdateBubbleDto,
  ): Promise<BubbleModel> {
    let bubble: BubbleModel = await this.bubbleModel.findOneAndUpdate(
      {
        businessId: business._id,
      },
      dto,
      {
        new: true,
      },
    ).exec();

    if (!bubble) {
      bubble = await this.createDefault(business._id);

      bubble = await this.bubbleModel.findOneAndUpdate(
        {
          _id: bubble._id,
        },
        dto,
        {
          new: true,
        },
      ).exec();
    }

    return bubble;
  }

  private async createDefault(businessId: string): Promise<BubbleModel> {
    return this.bubbleModel.create({
      ...defaultBubble,
      businessId: businessId,
    });
  }
}
