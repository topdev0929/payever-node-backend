import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ChannelQueryDto, AdminChannelDto } from '../dto';
import { ChannelModel, ChannelSchemaName } from '@pe/channels-sdk';


@Injectable()
export class ChannelService {

  constructor(
    @InjectModel(ChannelSchemaName) private readonly channelModel: Model<ChannelModel>,
  ) { }

  public async getForAdmin(query: ChannelQueryDto): Promise<any> {
    const limit: number = query.limit || 100;
    const page: number = query.page || 1;
    const offset: number = (page - 1) * limit;

    const conditions: any = { };

    if (query.searchString) {
      conditions.$text = { $search: query.searchString };
    }

    const documents: ChannelModel[] = await this.channelModel
      .find(conditions)
      .select(query.projection)
      .sort({ createdAt: 1 })
      .skip(offset)
      .limit(limit)
      .exec();

    const total: number = await this.channelModel.count().exec();

    return {
      documents,
      page,
      total,
    };
  }

  public async createForAdmin(dto: AdminChannelDto): Promise<ChannelModel> {
    return this.channelModel.create(dto);
  }

  public async updateForAdmin(channelId: string, dto: AdminChannelDto): Promise<ChannelModel> {
    return this.channelModel.findByIdAndUpdate(channelId, dto, { new: true });
  }

  public async deleteById(channelId: string): Promise<void> {
    await this.channelModel.findByIdAndDelete(channelId);
  }
}
