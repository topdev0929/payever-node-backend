import { ConflictException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { TaskStatusEnum, VideoGeneratorTaskTypeEnum } from '../enums';
import { VideoGeneratorTaskInterface } from '../interfaces';
import { VideoGeneratorTaskModel } from '../models';
import { VideoGeneratorTaskSchemaName } from '../schemas';
import { environment } from '../../environments';

@Injectable()
export class VideoGeneratorTaskService {
  constructor(
    @InjectModel(VideoGeneratorTaskSchemaName) private readonly taskModel: Model<VideoGeneratorTaskModel>,
  ) { }
  
  public async create(
    task: any,
    type: VideoGeneratorTaskTypeEnum,
  ): Promise<VideoGeneratorTaskModel> {
    const taskData: VideoGeneratorTaskInterface = {
      status: TaskStatusEnum.waiting,
      task: {
        data: task,
        type: type,
      },
      tries: 0,
    };

    let data: VideoGeneratorTaskModel;

    try {
      data = await this.taskModel.create(taskData);
    } catch (err) {
      if (err.name === 'MongoError' && err.code === 11000) {
        const date: Date = new Date();
        date.setHours(date.getHours() -
          (environment.processingMaxHours * environment.maxTaskTries));

        const failedTask: VideoGeneratorTaskModel = await this.taskModel.findOne({
          $and: [
            {
              task: {
                data: task,
                type: type,
              },
            },
            {
              $or: [
                {
                  tries: { $gt: environment.maxTaskTries },
                },
                {
                  updatedAt: { $lte: date },
                },
              ],
            },
          ],
        }).exec();

        if (failedTask) {
          failedTask.tries = 0;
          failedTask.status = TaskStatusEnum.waiting;
          await failedTask.save();

          return failedTask;
        } else {
          throw new ConflictException(err.errmsg);
        }
      } else {
        throw err;
      }
    }

    return data;
  }

  public async findWaitingTask(): Promise<VideoGeneratorTaskModel[]> {
    const date: Date = new Date();
    date.setHours(date.getHours() - environment.processingMaxHours);

    return this.taskModel.find({
      $or: [
        {
          $and: [
            { status: TaskStatusEnum.waiting},
            { tries: { $lte: environment.maxTaskTries } },
          ],
        },
        {
          $and: [
            { status: TaskStatusEnum.processing},
            { updatedAt: { $lte:  date } },
            { tries: { $lte: environment.maxTaskTries } },
          ],
        },
      ],
    }).sort({ createdAt: 1 });
  }

  public async remove(
    taskModel: VideoGeneratorTaskModel,
  ): Promise<void> {
    await this.taskModel.deleteOne({ _id: taskModel._id }).exec();
    await taskModel.remove();
  }

  public async setProcessing(
    taskModel: VideoGeneratorTaskModel,
  ): Promise<void> {
    await taskModel.updateOne({
      $inc: { tries: 1 },
      status: TaskStatusEnum.processing,
    }).exec();
  }

  public async setWaiting(
    taskModel: VideoGeneratorTaskModel,
  ): Promise<void> {
    await taskModel.update({
      status: TaskStatusEnum.waiting,
    }).exec();
  }
}
