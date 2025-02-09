import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { environment } from '../../environments';
import { MediaOwnerTypeEnum, TaskStatusEnum } from '../enums';
import { ImageAssessmentTaskInterface } from '../interfaces';
import { ImageAssessmentTaskModel, SubscriptionMediaModel, UserMediaModel } from '../models';
import { ImageAssessmentTaskSchemaName, SubscriptionMediaSchemaName, UserMediaSchemaName } from '../schemas';

@Injectable()
export class ImageAssessmentTaskService {
  private readonly processingMaxHours: number;

  constructor(
    @InjectModel(UserMediaSchemaName) private readonly userMediaModel: Model<UserMediaModel>,
    @InjectModel(SubscriptionMediaSchemaName) private readonly subscriptionMediaModel: Model<SubscriptionMediaModel>,
    @InjectModel(ImageAssessmentTaskSchemaName) private readonly taskModel: Model<ImageAssessmentTaskModel>,
  ) {
    this.processingMaxHours = environment.processingMaxHours;
  }

  public async create(imageAssessmentTask: ImageAssessmentTaskInterface): Promise<void> {
    try {
      await this.taskModel.create(imageAssessmentTask);
    } catch (err) {
      if (err.name === 'MongoError' && err.code === 11000) {
        await this.duplicateMongoErrorHandler(imageAssessmentTask);
      }
    }
  }

  public async findWaitingTask(): Promise<ImageAssessmentTaskModel[]> {
    const date: Date = new Date();
    date.setHours(date.getHours() - this.processingMaxHours);

    return this.taskModel.find(
      {
        $or: [
          {
            $and: [
              { status: TaskStatusEnum.waiting },
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
      },
    ).sort({ createdAt: 1 });
  }

  public async remove(
    mediaId: string,
    type: MediaOwnerTypeEnum,
  ): Promise<void> {
    await this.taskModel.remove(
      {
        mediaId: mediaId,
        type: type,
      },
    ).exec();
  }

  public async setProcessing(
    tasks: ImageAssessmentTaskModel[],
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
    mediaId: string,
    type: MediaOwnerTypeEnum,
  ): Promise<void> {
    await this.taskModel.updateOne(
      {
        mediaId: mediaId,
        type: type,
      },
      {
        status: TaskStatusEnum.waiting,
      },
    ).exec();
  }

  private async duplicateMongoErrorHandler(imageAssessmentTask: ImageAssessmentTaskInterface): Promise<void> {
    const date: Date = new Date();
    date.setHours(date.getHours() -
                    (environment.processingMaxHours * environment.maxTaskTries));
    const failedTask: ImageAssessmentTaskModel = await this.taskModel.findOne(
      {
        $and: [
          {
            mediaId: imageAssessmentTask.mediaId,
            type: imageAssessmentTask.type,
            url: imageAssessmentTask.url,
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
      },
    ).exec();

    if (failedTask) {
      failedTask.tries = 0;
      failedTask.status = TaskStatusEnum.waiting;
      await failedTask.save();
    }
  }
}
