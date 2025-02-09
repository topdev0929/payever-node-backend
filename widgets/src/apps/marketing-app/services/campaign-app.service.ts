import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { BusinessModel } from '../../../business/models';
import { ChannelSetModel } from '../../../statistics/models';
import { CampaignCreateDto } from '../dto/campaign-create.dto';
import { MongooseModel } from '../enums';
import { CampaignModel } from '../models';

@Injectable()
export class CampaignAppService {

  constructor(
    @InjectModel(MongooseModel.Campaign) private readonly campaignModel: Model<CampaignModel>,
  ) { }

  public async create(campaignCreateDto: CampaignCreateDto): Promise<CampaignModel> {
    const createdCampaign: CampaignModel = await this.campaignModel.create({
        ...campaignCreateDto,
        businessId: campaignCreateDto.business,
      } as unknown as CampaignModel);

    return this.campaignModel.findById(createdCampaign.id);
  }

  public async getLast(business: BusinessModel): Promise<CampaignModel[]> {
    return this.campaignModel.find(
      {
        businessId: business.id,
      },
      ['channelSet', 'name', 'contactsCount', 'createdAt', 'business'],
      {
        sort: {
          createdAt: -1,
        },
      },
    );
  }

  public async removeAllByBusiness(business: BusinessModel): Promise<void> {
    await this.campaignModel.deleteMany({ businessId: business.id }).exec();
  }

  public async removeAllByChannelSet(channelSet: ChannelSetModel): Promise<void> {
    await this.campaignModel.deleteMany({ channelSet: channelSet.id }).exec();
  }
}
