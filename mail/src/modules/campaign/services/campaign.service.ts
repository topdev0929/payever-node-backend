import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import {
  AbstractChannelSetService,
  ChannelEventMessagesProducer,
  ChannelModel,
  ChannelService,
  ChannelSetModel,
} from '@pe/channels-sdk';
import { Model, Query } from 'mongoose';
import { BusinessModel } from '../../business';
import { CreateCampaignInput, Pagination, UpdateCampaignInput } from '../classes';
import { CAMPAIGNS_DEFAULT_LIMIT } from '../constants';
import { CampaignStatus } from '../enums';
import { CampaignModel, CampaignsModel } from '../models';
import { ScheduleService } from './schedule.service';
import { EmailTemplateInterface } from '../interfaces';
import { AdminCampaignListDto } from '../dto';

@Injectable()
export class CampaignService {

  private logger: Logger = new Logger(CampaignService.name, true);

  constructor(
    @InjectModel('Business') private businessModel: Model<BusinessModel>,
    @InjectModel('Campaign') private model: Model<CampaignModel>,
    private channelService: ChannelService,
    private channelSetService: AbstractChannelSetService,
    private channelEventMessagesProducer: ChannelEventMessagesProducer,
    private scheduleService: ScheduleService,
  ) {
  }

  public async getCampaigns(
    business: BusinessModel,
    status: CampaignStatus,
    page?: number,
    limit?: number,
  ): Promise<CampaignsModel> {
    const pagination: Pagination = {
      page: page || 1,
      per_page: limit || CAMPAIGNS_DEFAULT_LIMIT,
    };

    const count: number = await this.getCampaignsCount(business, status);
    const filters: any = this.getFilter(business, status);
    const campaigns: CampaignModel[] = await this.model.find(filters)
      .populate('categories')
      .populate('schedules')
      .sort({ date: 'desc' })
      .skip((pagination.page - 1) * pagination.per_page)
      .limit(pagination.per_page)
      .exec();

    return {
      campaigns: campaigns,
      info: {
        pagination: {
          item_count: count,
          page: pagination.page,
          page_count: Math.ceil(count / pagination.per_page),
          per_page: pagination.per_page,
        },
      },
    } as CampaignsModel;
  }

  public async getCampaignsCount(business: BusinessModel, status?: CampaignStatus): Promise<number> {
    const filers: any = this.getFilter(business, status);

    return this.model.count(filers).exec();
  }

  public async getCampaign(id: string): Promise<CampaignModel> {
    return this.model.findById(id).populate('categories').populate('schedules');
  }

  public async getProcessCampaignByTheme(themeId: string): Promise<any[]> {
    return this.model.aggregate(
      [
        {
          $lookup: {
            as: 'schedules',
            foreignField: '_id',
            from: 'schedules',
            localField: 'schedules',
          },
        },
        {
          $match: {
            'schedules.status': 'process',
            themeId: themeId,
          },
        },
      ],
    );
  }

  public async getNotSavedCampaigns(date: Date): Promise<CampaignModel[]> {
    return this.model.find({ status: CampaignStatus.NotSaved, date: { $lt: date } }).exec();
  }

  public async createCampaign(business: BusinessModel, data: CreateCampaignInput): Promise<CampaignModel> {
    const channel: ChannelModel = await this.channelService.findOneByType('marketing');
    const channelSet: ChannelSetModel = await this.channelSetService.create(channel, business);
    await this.channelEventMessagesProducer.sendChannelSetNamedByApplication(channelSet, data.name);

    const campaignData: CreateCampaignInput = { ...data };
    delete campaignData.schedules;

    const campaign: CampaignModel = await this.model.create({
      ...campaignData, business: business._id, channelSet: channelSet._id,
    } as any);

    const savedSchedulesIds: string[] = await this.scheduleService.findAndUpdateSchedules(campaign, data.schedules);

    await this.businessModel.findOneAndUpdate(
      { _id: business.id },
      { $push: { campaigns: campaign._id }},
    );

    return this.model.findOneAndUpdate(
      { _id: campaign.id },
      { $set: { schedules: savedSchedulesIds }},
      { new: true },
    ).populate('categories').populate('schedules');
  }

  public async updateCampaign(id: string, data: UpdateCampaignInput): Promise<CampaignModel> {
    const campaignData: UpdateCampaignInput = { ...data };
    delete campaignData.schedules;

    const campaign: CampaignModel = await this.model.findByIdAndUpdate(id, campaignData as any, { new: true }).populate('categories');

    const savedSchedulesIds: string[] = await this.scheduleService.findAndUpdateSchedules(campaign, data.schedules);
    await this.scheduleService.deleteScheduleExceptIds(campaign, savedSchedulesIds);

    return this.model.findOneAndUpdate(
      { _id: campaign.id },
      { $set: { schedules: savedSchedulesIds }},
      { new: true },
    ).populate('categories').populate('schedules');
  }

  public async deleteCampaigns(businessId: string, ids: string[]): Promise<void> {
    for (const id of ids) {
      const campaign: CampaignModel = await this.getCampaign(id);
      await this.channelSetService.deleteOneById(campaign.channelSet);
      await this.channelEventMessagesProducer.sendChannelSetDeletedMessage(campaign.channelSet);
      await this.businessModel.updateOne(
        { _id: businessId },
        { $pull: { campaigns: id as any }},
      );
    }
    await this.model.remove({ _id: { $in: ids } }).exec();
  }

  public async deleteNotSavedCampaigns(date: Date): Promise<void> {
    await this.model.remove({ status: CampaignStatus.NotSaved, date: { $lt: date } }).exec();
  }

  public async isCampaignExists(id: string): Promise<boolean> {
    return this.model.count({ _id: id}).exec().then((count: number) => count > 0);
  }

  public async deleteAllByBusiness(business: BusinessModel): Promise<void> {

    const campaigns: CampaignModel[] = await this.model.find({ business: business.id });
    for (const campaign of campaigns) {
      await this.channelSetService.deleteOneById(campaign.channelSet);
      await this.channelEventMessagesProducer.sendChannelSetDeletedMessage(campaign.channelSet);
    }

    await this.model.deleteMany({ business: business.id });
  }

  public async removeProductId(productIds: string[]): Promise<void> {
    const campaigns: CampaignModel[] = await this.model.find({ productIds: { $in: productIds } }).exec();
    this.logger.log(`Found campaigns to update: ${campaigns ? campaigns.length : 0}`);
    if (campaigns && campaigns.length) {
      for (const campaign of campaigns) {
        await campaign.update({
          productIds: campaign.productIds.filter((item: string) => productIds.indexOf(item) === -1),
        })
        .exec();
      }
    }
  }

  public async setAttachments(campaignId: string, email: EmailTemplateInterface): Promise<CampaignModel> {
    return this.model.findOneAndUpdate(
      { _id: campaignId },
      {
        $set: {
          attachments: email.attachments,
          template: email.html,
        },
      },
      { new: true },
    );
  }

  public async retrieveListForAdmin(query: AdminCampaignListDto): Promise<any> {
    const limit: number = query.limit * 1 || 100;
    const page: number = query.page * 1 || 1;
    const offset: number = (page - 1) * limit;

    const conditions: any = { };

    if (query.businessIds) {
      conditions.business = { $in: query.businessIds };
    }

    if (query.channelSetIds) {
      conditions.channelSet = { $in: query.channelSetIds };
    }

    if (query.builderMailIds) {
      conditions.builderMailId = { $in: query.builderMailIds };
    }

    if (query.searchString) {
      conditions.$text = { $search: query.searchString };
    }

    const campaignsQuery: Query<CampaignModel[], any> = this.model
      .find(conditions)
      .select(query.projection)
      .sort({ createdAt: -1 })
      .skip(offset)
      .limit(limit);

    if (query.populate) {
      campaignsQuery
        .populate('categories')
        .populate('schedules');
    }

    const campaigns: CampaignModel[] = await campaignsQuery;

    const total: number = await this.model.count();

    return {
      campaigns,
      page,
      total,
    };
  }

  public async adminDelete(campaignId: string): Promise<CampaignModel> {
    const campaign: CampaignModel = (await this.model.findOne({ _id: campaignId }));
    await this.deleteCampaigns(campaign.business, [campaignId]);

    return campaign;
  }

  private getFilter(business: BusinessModel, status?: CampaignStatus): any {
    const filers: any = { business: business._id };
    if (status) {
      filers.status = status;
    }

    return filers;
  }
}
