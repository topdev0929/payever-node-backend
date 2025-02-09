import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { environment } from '../../environments';
import { MediaOwnerTypeEnum, MediaTypeEnum, TaskStatusEnum } from '../enums';
import { MediaInfoTaskInterface } from '../interfaces';
import { MediaInfoTaskModel, SubscriptionMediaModel, UserMediaModel } from '../models';
import { MediaInfoTaskSchemaName, SubscriptionMediaSchemaName, UserMediaSchemaName } from '../schemas';

@Injectable()
export class MediaInfoTaskService {
  private readonly processingTime: number;
  private readonly maxTaskTries: number;
  private readonly processingMaxHours: number;

  constructor(
    @InjectModel(MediaInfoTaskSchemaName) private readonly taskModel: Model<MediaInfoTaskModel>,
    @InjectModel(UserMediaSchemaName) private readonly userMediaModel: Model<UserMediaModel>,
    @InjectModel(SubscriptionMediaSchemaName) private readonly subscriptionMediaModel: Model<SubscriptionMediaModel>,
  ) {
    this.processingTime = (environment.processingMaxHours * environment.maxTaskTries);
    this.maxTaskTries = environment.maxTaskTries;
    this.processingMaxHours = environment.processingMaxHours;
  }

  public async create(
    mediaId: string,
    url: string,
    ownerType: MediaOwnerTypeEnum,
    mediaType: MediaTypeEnum,
  ): Promise<void> {
    const mediaInfoTask: MediaInfoTaskInterface = {
      mediaId: mediaId,
      mediaType: mediaType,
      ownerType: ownerType,
      status: TaskStatusEnum.waiting,
      tries: 0,
      url: url,
    };

    try {
      await this.taskModel.create(mediaInfoTask);
    } catch (err) {
      if (err.name === 'MongoError' && err.code === 11000) {
        await this.resetTask(mediaInfoTask);
      }
    }
  }

  public async findWaitingTask(mediaType: MediaTypeEnum, ownerType: MediaOwnerTypeEnum): Promise<MediaInfoTaskModel[]> {
    const date: Date = new Date();
    date.setHours(date.getHours() - this.processingMaxHours);

    return this.taskModel.find(
      {
        $or: [
          {
            $and: [
              { mediaType: mediaType },
              { ownerType: ownerType },
              { status: TaskStatusEnum.waiting },
              { tries: { $lte: this.maxTaskTries } },
            ],
          },
          {
            $and: [
              { mediaType: mediaType },
              { ownerType: ownerType },
              { status: TaskStatusEnum.processing},
              { updatedAt: { $lte:  date } },
              { tries: { $lte: this.maxTaskTries } },
            ],
          },
        ],
      },
    ).sort({ createdAt: 1 });
  }

  public async remove(
    tasks: MediaInfoTaskModel[],
  ): Promise<void> {
    for (const taskModel of tasks) {
      await this.taskModel.deleteOne({ _id: taskModel._id });
    }
  }

  public async setProcessing(
    tasks: MediaInfoTaskModel[],
  ): Promise<void> {
    for (const taskModel of tasks) {
      await taskModel.updateOne(
        {
          $inc: { tries: 1 },
          status: TaskStatusEnum.processing,
        },
      ).exec();
    }
  }

  public async setWaiting(
    tasks: MediaInfoTaskModel[],
  ): Promise<void> {
    for (const taskModel of tasks) {
      await taskModel.update(
        {
          status: TaskStatusEnum.waiting,
        },
      ).exec();
    }
  }

  private async resetTask(mediaInfoTask: MediaInfoTaskInterface): Promise<void> {
    const date: Date = new Date();
    date.setHours(date.getHours() - this.processingTime);
    const failedTask: MediaInfoTaskModel = await this.taskModel.findOne(
      {
        $and: [
          {
            mediaId: mediaInfoTask.mediaId,
            type: MediaOwnerTypeEnum.USER,
            url: mediaInfoTask.url,
          },
          {
            $or: [
              {
                tries: { $gt: this.maxTaskTries },
              },
              {
                updatedAt: { $lte: date },
              },
            ],
          },
        ],
      },
    ).exec();

    if (failedTask) {
      failedTask.tries = 0;
      failedTask.status = TaskStatusEnum.waiting;
      await failedTask.save();
    }
  }
}
