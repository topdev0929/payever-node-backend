import { Injectable, UnprocessableEntityException } from '@nestjs/common';
import { ResolutionDto } from '../dtos';
import { AbstractCollector, Collector } from '@pe/nest-kit/modules/collector-pattern';
import { ServiceTagEnum } from '../enums';
import { RuntimeException } from '@nestjs/core/errors/exceptions/runtime.exception';
import { VideoCompilerStrategyInterface } from '../strategies/video-compiler/interfaces';
import { PebEffect } from '@pe/builder-core';

@Injectable()
@Collector(ServiceTagEnum.VIDEO_COMPILER)
export class VideoCompilerEffectService extends AbstractCollector {

  constructor() {
    super();
  }

  public async compile(folder: string, fps: number, size: ResolutionDto, effects: PebEffect[]): Promise<void> {
    for (const effect of effects) {
      const strategy: VideoCompilerStrategyInterface = await this.getStrategy(effect.type);
      await strategy.runTask(folder, fps, size, effect);
    }
  }

  private async getStrategy(effect: string) : Promise<VideoCompilerStrategyInterface> {
    for (const strategy of this.services) {
      if (!VideoCompilerEffectService.isTaskStrategy(strategy)) {
        throw new RuntimeException(
          `Wrong service marked as a task strategy: ${
            strategy.constructor.name
          }`,
        );
      }
      if (strategy.type === effect) {
        return strategy;
      }
    }

    throw new UnprocessableEntityException(
      `No appropriate strategy found to verify the code with parameters: ${effect}`,
    );
  }

  private static isTaskStrategy(service: any): service is VideoCompilerStrategyInterface {

    return 'function' === typeof service.runTask;
  }
}
