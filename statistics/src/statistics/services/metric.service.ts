import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { BrowserModel, MetricModel } from '../models';
import { BrowserSchemaName, MetricSchemaName } from '../schemas';

@Injectable()
export class MetricService {
  constructor(
    @InjectModel(MetricSchemaName)
    private readonly metricModel: Model<MetricModel>,
    @InjectModel(BrowserSchemaName)
    private readonly browserModel: Model<BrowserModel>,
  ) { }

  public async findAll(conditions: any = { }): Promise<MetricModel[]> {
    return this.metricModel.find(conditions).sort({ name: 1 }).exec();
  }

  public async findBrowserAll(conditions: any = { }): Promise<BrowserModel[]> {
    return this.browserModel.find(conditions).exec();
  }
}
