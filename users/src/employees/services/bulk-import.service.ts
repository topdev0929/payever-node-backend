import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { BulkImport, BulkImportDocument } from '../schemas';

@Injectable()
export class BulkImportService {
  constructor(
    @InjectModel(BulkImport.name) private readonly bulkImportModel: Model<BulkImportDocument>,

  ) { }

  public async createImportTask(): Promise<BulkImportDocument> {
    return this.bulkImportModel.create({ });
  }

  public async findById(id: string): Promise<BulkImportDocument> {
    return  this.bulkImportModel.findById(id);
  }

  public async updateLatestReport(bulkImportId: string, reportId: string): Promise<BulkImportDocument> {
    return this.bulkImportModel.findOneAndUpdate(
      { _id: bulkImportId },
      { $set: { latestReport: reportId } },
      { new: true },
    );
  }

  public async addTask(
    bulkImportId: string,
    taskId: string,
  ): Promise<BulkImportDocument> {
    return this.bulkImportModel.findOneAndUpdate(
      { _id: bulkImportId },
      { $addToSet: { tasks: taskId } },
      { new: true },
    );
  }
}
