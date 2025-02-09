import { HttpService, Injectable } from '@nestjs/common';
import * as sizeOf from 'image-size';
import * as fileSize from 'filesize';
import { MediaInfoInterface } from '../interfaces';
import { MediaInfoTaskModel, SubscriptionMediaModel, UserMediaModel } from '../models';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { MediaInfoTaskSchemaName, SubscriptionMediaSchemaName, UserMediaSchemaName } from '../schemas';
import { VideoHelper } from '../helpers';

@Injectable()
export class MediaInfoService {

  constructor(
    @InjectModel(UserMediaSchemaName) private readonly userMediaModel: Model<UserMediaModel>,
    @InjectModel(SubscriptionMediaSchemaName) private readonly subscriptionMediaModel: Model<SubscriptionMediaModel>,
    @InjectModel(MediaInfoTaskSchemaName) private readonly taskModel: Model<MediaInfoTaskModel>,
    private readonly httpService: HttpService,
  ) {
  }

  public async getImageInfoFromTask(mediaInfoTasks: MediaInfoTaskModel[]): Promise<MediaInfoInterface[]> {
    const promise: any[] = [];
    for (const task of mediaInfoTasks) {
      promise.push(this.getImageInfoFromUrl(task.url, task.mediaId));
    }

    return Promise.all(promise);
  }

  public async getVideoInfoFromTask(mediaInfoTasks: MediaInfoTaskModel[]): Promise<MediaInfoInterface[]> {
    const promise: any[] = [];
    for (const task of mediaInfoTasks) {
      promise.push(this.getVideoInfoFromUrl(task.url, task.mediaId));
    }

    return Promise.all(promise);
  }

  private async getImageInfoFromUrl(url: string, mediaId: string): Promise<MediaInfoInterface> {
    const response: any = await this.httpService.axiosRef(
      {
        method: 'GET',
        responseType: 'arraybuffer',
        url: url,
      });

    const data: any = sizeOf.imageSize(response.data);

    return {
      dimension: `${data.width} x ${data.height}`,
      mediaId: mediaId,
      size: fileSize(response.headers['content-length']),
      type: response.headers['content-type'],
    };
  }

  private async getVideoInfoFromUrl(url: string, mediaId: string): Promise<MediaInfoInterface> {
    const response: any = await this.httpService.axiosRef(
      {
        method: 'GET',
        responseType: 'arraybuffer',
        url: url,
      });

    const data: any = await VideoHelper.getVideoInfo(url);

    return {
      dimension: `${data.size.width} x ${data.size.height}`,
      duration: `${data.duration} Sec`,
      mediaId: mediaId,
      size: fileSize(response.headers['content-length']),
      type: response.headers['content-type'],
    };
  }
}
