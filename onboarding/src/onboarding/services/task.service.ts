import { v4 as uuid } from 'uuid';

import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { RabbitMqClient } from '@pe/nest-kit';

import { RabbitBinding } from '../enums/rabbit-binding.enum';
import { TaskModel } from '../models';
import { ProcessingStatus } from '../enums';
import { SetupMessageInterface } from '../interfaces/incoming';
import { TaskOptionsInterface } from '../interfaces';
import { TaskRmqMessageDto } from '../dto';
import { BulkImportService } from './bulk-import.service';

@Injectable()
export class TaskService {
  constructor(
    @InjectModel('Task') private readonly taskModel: Model<TaskModel>,
    private readonly rabbitClient: RabbitMqClient,
    private readonly bulkImportService: BulkImportService,
  ) { }

  public async createTask(
    data: SetupMessageInterface, 
    options: TaskOptionsInterface, 
    bulkImportId: string,
  ): Promise<void> {
    const task: TaskModel = await this.taskModel.create({
      bulkImportId,
      businessId: uuid(),
      incomingData: data,
      status: ProcessingStatus.Created,
      token: options.accessToken,
      user: options.user,
      userAgent: options.userAgent,
    });

    await this.bulkImportService.addTask(bulkImportId, task._id);

    const payload: TaskRmqMessageDto = {
      _id: task._id,
    };

    await this.rabbitClient.send(
      {
        channel: RabbitBinding.OnboardingTaskCreated,
        exchange: 'async_events',
      },
      {
        name: RabbitBinding.OnboardingTaskCreated,
        payload,
      },
    );
  }

  public async findByBulkImport(bulkImportId: string): Promise<TaskModel[]> {
    return this.taskModel.find({ bulkImportId });
  }

  public async updateByBulkImport(bulkImportId: string, update: any): Promise<TaskModel> {
    return this.taskModel.findOneAndUpdate({ bulkImportId }, { $set: update }, { new: true });
  }

  public async findById(id: string): Promise<TaskModel> {
    return  this.taskModel.findById(id);
  }

  public async findTasksByUser(userId: string): Promise<TaskModel> {
    return this.taskModel.findOne({ 'user.id': userId });
  }
}
