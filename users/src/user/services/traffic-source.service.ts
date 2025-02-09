import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { BusinessModel, TrafficSourceModel } from '../models';
import { TrafficSourceSchemaName } from '../schemas';
import { TrafficSourceDto } from '../dto';

@Injectable()
export class TrafficSourceService {

  constructor(
    @InjectModel(TrafficSourceSchemaName) private readonly trafficSourceModel: Model<TrafficSourceModel>,
  ) { }

  public async createTrafficSource(
    business: BusinessModel,
    trafficSourceDto: TrafficSourceDto,
  ): Promise<TrafficSourceModel> {
    return this.trafficSourceModel.create({
      businessId : business._id,
      campaign: trafficSourceDto.campaign,
      content: trafficSourceDto.content,
      medium: trafficSourceDto.medium,
      source: trafficSourceDto.source,
    });
  }
}
