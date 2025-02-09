import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { CheckoutModel } from '../models';
import { Model } from 'mongoose';
import { CheckoutSchemaName } from '../schemas';
import { CheckoutEventDto } from '../dto';

@Injectable()
export class CheckoutService {
  constructor(
    @InjectModel(CheckoutSchemaName) private readonly checkoutModel: Model<CheckoutModel>,
  ) { }

  public async createOrUpdateCheckoutFromEvent(data: CheckoutEventDto): Promise<CheckoutModel> {
    return this.checkoutModel.findOneAndUpdate(
      { _id: data.checkoutId },
      {
        $set: {
          businessId: data.businessId,
          default: data.default,
          linkChannelSetId: data.linkChannelSetId,
          name: data.name,
        },
      },
      { new: true, upsert: true },
    );
  }

  public async deleteCheckout(data: CheckoutEventDto): Promise<void> {
    await this.checkoutModel.deleteOne({ _id: data.checkoutId }).exec();
  }

  public async getDefaultBusinessCheckout(businessId: string): Promise<CheckoutModel> {
    return this.checkoutModel.findOne({
      businessId,
      default: true,
    });
  }
}
