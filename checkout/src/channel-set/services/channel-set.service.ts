import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { BusinessModel } from '../../business';
import { CheckoutModel } from '../../checkout';
import { BusinessSchemaName, ChannelSetSchemaName } from '../../mongoose-schema';
import { ChannelSetInterface } from '../interfaces';
import { ChannelSetModel } from '../models';
import { ChannelSetRabbitProducer } from '../producers';
import { AdminChannelSetListDto } from '../dto';
import { Mutex } from '@pe/nest-kit/modules/mutex';

@Injectable()
export class ChannelSetService {
  constructor(
    @InjectModel(BusinessSchemaName) private readonly businessModel: Model<BusinessModel>,
    @InjectModel(ChannelSetSchemaName) private readonly channelSetModel: Model<ChannelSetModel>,
    private readonly channelSetRabbitProducer: ChannelSetRabbitProducer,
    private readonly logger: Logger,
    private readonly mutex: Mutex,
  ) { }

  public async createOrUpdate(
    business: BusinessModel,
    channelSetId: string,
    dto: ChannelSetInterface,
  ): Promise<ChannelSetModel> {
    const channelSet: ChannelSetModel = await this.createOrUpdateById(
      channelSetId,
      dto,
    );

    await business.populate('channelSets').execPopulate();
    const channelSets: ChannelSetModel[] = business.channelSets as ChannelSetModel[];
    if (!channelSets.find((x: ChannelSetModel) => x.id === channelSetId)) {
      await this.businessModel.findOneAndUpdate(
        { _id: business.id },
        { $push: { channelSets: channelSet.id }},
      );
    }

    return channelSet;
  }

  public async update(
    channelSetId: string,
    dto: ChannelSetInterface,
  ): Promise<ChannelSetModel> {
    return this.createOrUpdateById(
      channelSetId,
      dto,
    );
  }

  public async applyDefaultCheckout(
    business: BusinessModel,
    channelSet: ChannelSetModel,
    defaultCheckout?: CheckoutModel,
  ): Promise<void> {
    if (!defaultCheckout) {
      this.logger.error(`No default checkout for business ${business.id} found`);
    }

    await this.setCheckout(channelSet, defaultCheckout);
  }

  public async applyCheckoutToChannelSetId(channelSetId: string, checkout: CheckoutModel): Promise<void> {
    const channelSet: ChannelSetModel = await this.createOrUpdateById(
      channelSetId,
      {
        checkout: checkout.id,
      },
    );

    await this.channelSetRabbitProducer.checkoutLinkedToChannelSet(checkout, channelSet);
  }

  public async setCheckout(channelSet: ChannelSetModel, checkout?: CheckoutModel): Promise<void> {
    if (checkout) {
      await this.channelSetModel.updateOne(
        { _id: channelSet.id },
        { checkout: checkout.id },
      );
      await this.channelSetRabbitProducer.checkoutLinkedToChannelSet(checkout, channelSet);
    } else {
      await this.channelSetModel.updateOne(
        { _id: channelSet.id },
        { $unset: { checkout: null }},
      );
    }
  }

  public async findOneById(id: string): Promise<ChannelSetModel> {
    return this.channelSetModel.findById(id);
  }

  public async findOneByIdOrOriginalId(id: string): Promise<ChannelSetModel> {
    return this.channelSetModel.findOne({
      $or: [
        { _id: id },
        { originalId: id },
      ],
    });
  }

  public async findManyByIdList(channelSets: string[]): Promise<ChannelSetModel[]> {
    return this.channelSetModel.find({ _id: { $in: [...channelSets] } });
  }

  public async deleteOneById(id: string): Promise<void> {
    await this.channelSetModel.deleteOne({ _id: id });

    await this.businessModel.updateOne(
      { channelSets: id },
      {
        $pull: {
          channelSets: id,
        },
      },
    );
  }

  public async findAllByCheckout(checkout: CheckoutModel): Promise<ChannelSetModel[]> {
    return this.channelSetModel.find({ checkout: checkout.id });
  }

  public async findAllByTypeAndCheckout(type: string, checkout: CheckoutModel): Promise<ChannelSetModel[]> {
    return this.channelSetModel.find({ type: type, checkout: checkout.id });
  }

  public async getChannelSetBusiness(channelSet: ChannelSetModel): Promise<BusinessModel> {
    const checkout: CheckoutModel = channelSet.checkout;

    return this.businessModel.findById(checkout.businessId);
  }

  public async findDefaultForBusiness(
    business: BusinessModel,
    channelType: string,
    defaultCheckout?: CheckoutModel,
  ): Promise<ChannelSetModel> {
    if (defaultCheckout) {
      const channelSet: ChannelSetModel = await this.channelSetModel.findOne(
      {
        checkout: defaultCheckout.id,
        type: channelType,
      });

      if (channelSet) {
        return channelSet;
      }
    }

    // If no channelSet in default checkout - find in other ones;
    await business.populate('channelSets').execPopulate();
    const channelSets: ChannelSetModel[] = business.channelSets as ChannelSetModel[];

    return channelSets.find((x: ChannelSetModel) => x.type === channelType);
  }

  public async findSpecificSubTypeChannelSet(
    business: BusinessModel,
    channelType: string,
    channelSubType: string,
    defaultCheckout?: CheckoutModel,
  ): Promise<ChannelSetModel> {
    if (defaultCheckout) {
      const channelSet: ChannelSetModel = await this.channelSetModel.findOne(
        {
          checkout: defaultCheckout.id,
          subType: channelSubType,
          type: channelType,
        });

      if (channelSet) {
        return channelSet;
      }
    }

    // If no channelSet in default checkout - find in other ones;
    await business.populate('channelSets').execPopulate();
    const channelSets: ChannelSetModel[] = business.channelSets as ChannelSetModel[];

    return channelSets.find((businessChannelSet: ChannelSetModel) => {
      return businessChannelSet.type === channelType && businessChannelSet.subType === channelSubType;
    });
  }

  public async createOrUpdateById(id: string, data: ChannelSetInterface): Promise<ChannelSetModel> {
    const setOnInsert: any = { };
    
    if (!data.hasOwnProperty('policyEnabled')) {
      setOnInsert.policyEnabled = true;
    }

    return this.mutex.lock(
      'checkout-channel-set',
      id,
        async () => this.channelSetModel.findOneAndUpdate(
        {
          _id: id,
        },
        {
          $set: data,
          $setOnInsert: setOnInsert,
        },
        {
          new: true,
          upsert: true,
        },
      ),
    );
  }

  public async updateById(channelSetId: string, data: { }): Promise<void> {
    const updatedData: any = { };
    for (const key of Object.keys(data)) {
      updatedData[`${key}`] = data[key];
    }

    await this.channelSetModel.updateOne(
      { _id: channelSetId },
      { $set: updatedData },
    );
  }

  public async retrieveListForAdmin(query: AdminChannelSetListDto): Promise<any> {
    const limit: number = query.limit || 100;
    const page: number = query.page || 1;
    const offset: number = (page - 1) * limit;

    const conditions: any = { };

    if (query.searchString) {
      conditions.$text = { $search: query.searchString };
    }

    const channelSets: ChannelSetModel[] = await this.channelSetModel
      .find(conditions)
      .select(query.projection)
      .sort({ createdAt: 1 })
      .skip(offset)
      .limit(limit);

    const total: number = await this.channelSetModel.count({ });

    return {
      channelSets,
      page,
      total,
    };
  }

}
