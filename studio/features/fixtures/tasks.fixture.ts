import { BaseFixture } from '@pe/cucumber-sdk/module';
import { Model } from 'mongoose';
import { getModelToken } from '@nestjs/mongoose';
import { VideoGeneratorTaskModel } from '../../src/studio/models';
import { VideoGeneratorTaskSchemaName } from '../../src/studio/schemas/video-generator-task-schema';

const BUSINESS_ID: string = '08d30292-0b3c-4b5d-a6ec-93ba43d6c81d';

class TaskFixture extends BaseFixture {
  private readonly taskModel: Model<VideoGeneratorTaskModel> = this.application.get(getModelToken(VideoGeneratorTaskSchemaName));

  public async apply(): Promise<void> {
    const task: any[] = [
       {
          "status": "waiting",
          "task": {
              "type": "generate-random-video",
              "data": {
                  "body": {
                      "audio": "http://localhost:2020/video/audio.mp3",
                      "errorMargin": 20,
                      "videoCutOptions": [
                          {
                              "video": "http://localhost:2020/video/input3.mp4",
                              "duration": 3,
                              "noClips": 2
                          },
                          {
                              "video": "http://localhost:2020/video/input4.mp4",
                              "duration": 3,
                              "noClips": 2
                          }
                      ]
                  },
                  "businessId": "08d30292-0b3c-4b5d-a6ec-93ba43d6c81d"
              }
          },
          "tries": 0
      },
      {
          "status": "waiting",
          "task": {
              "type": "generate-frames",
              "data": {
                  "videoPath": "http://localhost:2020/video/input2.mp4"
              }
          },
          "tries": 0
      },
      {
          "status": "waiting",
          "task": {
              "type": "generate-video-by-tag",
              "data": {
                  "body": {
                      "tags": [
                          "car",
                          "people"
                      ],
                      "audio": "http://localhost:2020/video/audio.mp3",
                      "duration": 48
                  },
                  "businessId": "08d30292-0b3c-4b5d-a6ec-93ba43d6c81d"
              }
          },
          "tries": 0
      }
    ]
    await this.taskModel.create(task);
  }
}

export = TaskFixture;
