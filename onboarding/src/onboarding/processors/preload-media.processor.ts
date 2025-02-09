import { Injectable } from '@nestjs/common';

import { TaskProcessor } from '../decorators/task.processor';
import { AbstractProcessor } from './abstract.processor';
import { TaskType } from '../enums';
import { ReportDetailDocument, TaskDocument } from '../schemas';
import { TaskModel } from '../models';
import { RunInstructionResult } from '../interfaces';

/**
 * @ref nodejs-backend/media/src/media/dto/blob-created.dto.ts
 */
interface ImageUploadResult {
  blobName: string;
  brightnessGradation?: string;
  preview?: string;
  thumbnail?: string;
}

@Injectable()
@TaskProcessor(TaskType.PreloadMedia)
export class PreloadMediaProcessor extends AbstractProcessor {
  protected required: string[];
  public async runInstruction(task: TaskDocument): Promise<RunInstructionResult> {
    const result: RunInstructionResult = { };
    result.wallpaper = task.incomingData.business.currentWallpaper?.wallpaper;
    result.logo = task.incomingData.business.logo;
    result.checkoutLogo = task.incomingData.checkout.logo;

    return result;
  }

  public async revertInstruction(task: TaskDocument): Promise<void> {
  
  }

  public async validateInstruction(
    task: TaskModel, 
    reportDetail: ReportDetailDocument,
  ): Promise<any> { }
}
