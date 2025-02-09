import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { RabbitMqClient } from '@pe/nest-kit';

import { BulkImportModel } from '../models';
import { BulkImport } from '../schemas';
@Injectable()
export class BulkImportService {
  constructor(
    @InjectModel(BulkImport.name) private readonly bulkImportModel: Model<BulkImportModel>,
    private readonly rabbitClient: RabbitMqClient,
  ) { }
  
  public async findById(id: string): Promise<BulkImportModel> {
    return  this.bulkImportModel.findById(id);
  }

  public async createImportTask(): Promise<BulkImportModel> {
    return this.bulkImportModel.create({ });
  }

  public async updateLatestReport(bulkImportId: string, reportId: string): Promise<BulkImportModel> {
    return this.bulkImportModel.findOneAndUpdate(
      { _id: bulkImportId },
      { $set: { latestReport: reportId } },
      { new: true },
    );
  }

  public async addTask(bulkImportId: string, taskId: string): Promise<BulkImportModel> {
    return this.bulkImportModel.findOneAndUpdate(
      { _id: bulkImportId },
      { $addToSet: { tasks: taskId } },
      { new: true },
    );
  }
}
