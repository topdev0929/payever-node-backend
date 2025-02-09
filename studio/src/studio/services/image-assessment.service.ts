import { HttpService, Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ImageAssessmentTypeEnum, MediaOwnerTypeEnum } from '../enums';
import { ImageAssessmentInterface, ImageAssessmentResultInterface } from '../interfaces';
import { ImageAssessmentTaskModel, SubscriptionMediaModel, UserMediaModel } from '../models';
import { SubscriptionMediaSchemaName, UserMediaSchemaName } from '../schemas';
import * as os from 'os';
import * as mkdirp from 'mkdirp';
import { UrlHelper } from '../helpers';
import * as fs from 'fs';
import * as randomstring from 'randomstring';
import * as formData from 'form-data';
import { ImageAssessmentTaskService } from './image-assessment-task.service';
import { environment } from '../../environments';

const technicalModel: string = 'weights_mobilenet_technical_0.11.hdf5';
const aestheticModel: string = 'weights_mobilenet_aesthetic_0.07.hdf5';

@Injectable()
export class ImageAssessmentService {
  private readonly nimaAssessmentHost: string;

  constructor(
    @InjectModel(SubscriptionMediaSchemaName) private readonly subscriptionMediaModel: Model<SubscriptionMediaModel>,
    @InjectModel(UserMediaSchemaName) private readonly userMediaModel: Model<UserMediaModel>,
    private readonly httpService: HttpService,
    private readonly imageAssessmentTaskService: ImageAssessmentTaskService,
    private readonly logger: Logger,
  ) {
    this.nimaAssessmentHost = environment.nimaAssessmentHost;
  }

  public async runTask(
    imageAssessmentTasks: ImageAssessmentTaskModel[],
  ): Promise<void> {
    if (!imageAssessmentTasks || imageAssessmentTasks.length === 0) {
      return ;
    }

    this.logger.log('Assessing image...');

    const imagesFolder: string = await this.downloadImagesTemp(imageAssessmentTasks);
    await this.processImageFolder(imagesFolder, MediaOwnerTypeEnum.USER);
    await this.processImageFolder(imagesFolder, MediaOwnerTypeEnum.SUBSCRIPTION);
  }

  private async processImageFolder(folderPath: string, type: MediaOwnerTypeEnum): Promise<void> {
    this.logger.log(`Assessing folder: ${folderPath}/${type}`);

    const files: string[] = fs.readdirSync(`${folderPath}/${type}`);
    for (const file of files) {
      this.logger.log(`Assessing file: ${folderPath}/${type}/${file}`);
      const filePath: string = `${folderPath}/${type}/${file}`;
      try {
        await this.processImage(filePath, type);
        await this.imageAssessmentTaskService.remove(this.parseMediaIdFromPath(filePath), type);
      } catch (e) {
        this.logger.log('Error processing image');
        this.logger.log(e);
        await this.imageAssessmentTaskService.setWaiting(this.parseMediaIdFromPath(filePath), type);
      }
    }
  }

  private async processImage(filePath: string, type: MediaOwnerTypeEnum): Promise<void> {
    const mediaId: string = this.parseMediaIdFromPath(filePath);
    const aestheticAssessment: ImageAssessmentResultInterface[]
      = await this.assessFile(filePath, ImageAssessmentTypeEnum.AESTHETHIC);
    const technicalAssessment: ImageAssessmentResultInterface[]
      = await this.assessFile(filePath, ImageAssessmentTypeEnum.TECHNICAL);
    const imageAssessment: ImageAssessmentInterface = {
      aesthetic: parseFloat(aestheticAssessment[0].mean_score_prediction),
      technical: parseFloat(technicalAssessment[0].mean_score_prediction),
    };

    switch (true) {
      case type === MediaOwnerTypeEnum.USER:
        await this.updateUserMediaAssessment(mediaId, imageAssessment);
        break;

      case type === MediaOwnerTypeEnum.SUBSCRIPTION:
        await this.updateSubscriptionMediaAssessment(mediaId, imageAssessment);
        break;
    }
  }

  private async updateUserMediaAssessment(
    mediaId: string,
    imageAssessment: ImageAssessmentInterface,
  ): Promise<void> {
    await this.userMediaModel.updateOne(
      { _id: mediaId},
      {
        $set: {
          assessment: imageAssessment,
        },
      },
    ).exec();
  }

  private async updateSubscriptionMediaAssessment(
    mediaId: string,
    imageAssessment: ImageAssessmentInterface,
  ): Promise<void> {
    await this.subscriptionMediaModel.updateOne(
      { _id: mediaId},
      {
        $set: {
          assessment: imageAssessment,
        },
      },
    ).exec();
  }

  private parseMediaIdFromPath(filePath: string): string {
    const regex: RegExp = /.+\/(.+)\..+/gm;
    const strArr: string[] = regex.exec(filePath);

    return strArr[1];
  }

  private async assessFile(
    filePath: string,
    assessment: ImageAssessmentTypeEnum,
  ): Promise<ImageAssessmentResultInterface[]> {
    const form: formData = new formData();
    form.append('file', fs.createReadStream(filePath));

    this.logger.log('Form to assess');
    this.logger.log(form);

    const response: any = await this.httpService.axiosRef(
      {
        data: form,
        headers: form.getHeaders(),
        method: 'POST',
        responseType: 'json',
        url: `${this.nimaAssessmentHost}/${assessment}`,
      });

    this.logger.log('Nima-wrapper response');
    this.logger.log(response.data);

    return JSON.parse(response.data.replace(/1\/1.+step/g, '').toString());
  }

  private async downloadImagesTemp(
    tasks: ImageAssessmentTaskModel[],
  ): Promise<string> {
    const tempFolder: string = `${os.tmpdir()}/image-assessment/${randomstring.generate(7)}`;
    const userTempFolder: string = `${tempFolder}/${MediaOwnerTypeEnum.USER}`;
    await mkdirp(userTempFolder);
    const subscriptionTempFolder: string = `${tempFolder}/${MediaOwnerTypeEnum.SUBSCRIPTION}`;
    await mkdirp(subscriptionTempFolder);
    const promise: any[] = [];

    tasks.forEach((data: ImageAssessmentTaskModel) => {
      let path: string = tempFolder;
      switch (true) {
        case data.type === MediaOwnerTypeEnum.USER :
          path = `${userTempFolder}/${data.mediaId}.${UrlHelper.getExtention(data.url)}`;
          break;
        case data.type === MediaOwnerTypeEnum.SUBSCRIPTION:
          path = `${subscriptionTempFolder}/${data.mediaId}.${UrlHelper.getExtention(data.url)}`;
          break;
      }
      promise.push(this.downloadSingleImage(path, data.url));
    });

    await Promise.all(promise);

    return tempFolder;
  }

  private async downloadSingleImage(
    path: string,
    url: string,
  ): Promise<void> {
    try {
      const writer: any = fs.createWriteStream(path);
      const response: any = await this.httpService.axiosRef(
        {
          method: 'GET',
          responseType: 'stream',
          url: url,
        });
      response.data.pipe(writer);
    } catch (e) {
      this.logger.log('Error downloading image');
      this.logger.log(e);
    }
  }
}
