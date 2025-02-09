import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Task } from '../schemas';

@Injectable()
export class TaskService {
  constructor(
    @InjectModel(Task.name) private readonly taskModel: Model<Task>,
  ) { }

  public async createTasks(task: Task[]): Promise<void> {
    await this.taskModel.insertMany(task);
  }

  public async findBy(condition: any): Promise<Task[]> {
    return this.taskModel.find(condition);
  }

  public async findById(id: string): Promise<Task> {
    return this.taskModel.findById(id);
  }

  public async findByBulkImportId(bulkImportId: string): Promise<Task[]> {
    return this.taskModel.find({ bulkImportId });
  }

  public async getDistinctBusinesses(bulkImportId: string): Promise<string[]> {
    return this.taskModel.distinct('businessId', { bulkImportId });
  }
}
