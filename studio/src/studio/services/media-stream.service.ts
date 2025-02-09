import { Injectable, UnprocessableEntityException } from '@nestjs/common';
import { RuntimeException } from '@nestjs/core/errors/exceptions/runtime.exception';
import { AbstractCollector, Collector } from '@pe/nest-kit/modules/collector-pattern';
import { FastifyReply } from 'fastify';
import { ServiceTagEnum } from '../enums';
import { MediaStreamStrategyInterface } from '../strategies/stream/interfaces';

@Injectable()
@Collector(ServiceTagEnum.MEDIA_STREAM)
export class MediaStreamService extends AbstractCollector{
  constructor() {
    super();
  }

  public async streamMedia(
    url: string, 
    res: FastifyReply<any>, 
    method: string,
    range: string,
  ) : Promise<void> {
    const strategy: MediaStreamStrategyInterface = await this.getStrategy(method);

    return strategy.streamMedia(url, res, range);
  }

  private async getStrategy(method: string) : Promise<MediaStreamStrategyInterface> {
    for (const strategy of this.services) {
      if (!MediaStreamService.isMediaStreamStrategy(strategy)) {
        throw new RuntimeException(
          `Wrong service marked as a media stream strategy: ${
            strategy.constructor.name
          }`,
        );
      }
      if (strategy.type === method) {
        return strategy;
      }
    }  
    
    throw new UnprocessableEntityException(
      `No appropriate strategy found to verify the code with parameters: ${method}`,
    );
  }

  private static isMediaStreamStrategy(service: any): service is MediaStreamStrategyInterface {

    return 'function' === typeof service.streamMedia;
  }
}
