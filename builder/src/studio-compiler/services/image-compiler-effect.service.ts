import { Injectable, UnprocessableEntityException } from '@nestjs/common';
import { ImageCompilerEffectDto } from '../dtos';
import { AbstractCollector, Collector } from '@pe/nest-kit/modules/collector-pattern';
import { ServiceTagEnum } from '../enums';
import { ImageCompilerStrategyInterface } from '../strategies/image-compiler/interfaces';
import { RuntimeException } from '@nestjs/core/errors/exceptions/runtime.exception';

@Injectable()
@Collector(ServiceTagEnum.IMAGE_COMPILER)
export class ImageCompilerEffectService extends AbstractCollector {
  constructor() {
    super();
  }

  public async compile(file: string, effects: ImageCompilerEffectDto[]): Promise<void> {
    for (const effect of effects) {
      const strategy: ImageCompilerStrategyInterface = await this.getStrategy(effect.type);
      await strategy.runTask(file, effect);
    }
  }


  private async getStrategy(effect: string) : Promise<ImageCompilerStrategyInterface> {
    for (const strategy of this.services) {
      if (!ImageCompilerEffectService.isTaskStrategy(strategy)) {
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

  private static isTaskStrategy(service: any): service is ImageCompilerStrategyInterface {

    return 'function' === typeof service.runTask;
  }
}
