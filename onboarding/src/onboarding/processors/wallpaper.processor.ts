import { Injectable } from '@nestjs/common';
import { AxiosResponse } from 'axios';

import { environment } from '../../environments';
import { TaskProcessor } from '../decorators/task.processor';
import { RabbitBinding, TaskType, WallpaperThemeEnum } from '../enums';
import { AbstractProcessor } from './abstract.processor';
import { TaskModel } from '../models';
import { PreloadMediaProcessor } from './preload-media.processor';
import { ReportDetailDocument } from '../schemas';
import { pick, isMatch } from 'lodash';
import { RunInstructionResult, ValidateInstructionResultDataInterface } from '../interfaces';

export interface WallpaperInterface {
  wallpaper: string;
  theme: WallpaperThemeEnum;
  name?: string;
}
export interface BusinessWallpapersInterface {
  businessId: string;
  myWallpapers: WallpaperInterface[];
  currentWallpaper?: WallpaperInterface;
  product?: string;
  industry?: string;
  type?: string;
}

@Injectable()
@TaskProcessor(TaskType.Wallpaper)
export class WallpaperProcessor extends AbstractProcessor {
  protected required: string[] = [
    TaskType.Business,
    TaskType.Apps,
    TaskType.PreloadMedia,
  ];

  public async runInstruction(task: TaskModel): Promise<RunInstructionResult> {
    const wallpaperBlobName: string = task.resultData[PreloadMediaProcessor.name]?.result?.wallpaper;
    if (wallpaperBlobName) {

      const wallpaperPayload = {
        industry: task.incomingData.business.companyDetails.industry,
        theme: 'default',
        wallpaper: wallpaperBlobName,
      };

      await this.rabbitClient.send(
        {
          channel: RabbitBinding.OnboardingSetupWallpaper,
          exchange: 'async_events',
        },
        {
          name: RabbitBinding.OnboardingSetupWallpaper,
          payload: { businessId: task.businessId, data: wallpaperPayload },
        },
      );
    }

    return { };
  }

  public async revertInstruction(task: TaskModel): Promise<void> { }
  
  public async validateInstruction(
    task: TaskModel, 
    reportDetail: ReportDetailDocument,
  ): Promise<ValidateInstructionResultDataInterface> {
    const businessDetailsResult: AxiosResponse<BusinessWallpapersInterface> = 
    await this.httpService.get<BusinessWallpapersInterface>(
      [
        environment.microservices.wallpapersUrl,
        `/api/business/${task.businessId}/wallpapers`,
      ].join(''),
      this.getAxiosRequestConfig(task),
    ).toPromise();

    const actualDetails: Partial<BusinessWallpapersInterface> = this.getDetails(businessDetailsResult.data);
    const expectedDetails: Partial<BusinessWallpapersInterface> = this.getDetails(task.incomingData.business);

    const actual: any = { 
      theme: actualDetails.currentWallpaper?.theme, 
      wallpaper: !!actualDetails.currentWallpaper?.wallpaper,
    };

    const expected: any = { 
      theme: expectedDetails.currentWallpaper.theme, 
      wallpaper: !!expectedDetails.currentWallpaper.wallpaper, 
    };

    return {
      actual,
      expected,
      valid: isMatch(actual, expected),
    };
  }

  private getDetails(data: any): Partial<any> {
    return pick(data, ['currentWallpaper']);
  }
}
