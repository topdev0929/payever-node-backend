import { HttpService, Injectable } from '@nestjs/common';
import { ServiceTag } from '@pe/nest-kit/modules/collector-pattern';
import { FastifyReply } from 'fastify';
import { MediaTypeEnum, ServiceTagEnum } from '../../enums';
import { MediaStreamStrategyInterface } from './interfaces';

@Injectable()
@ServiceTag(ServiceTagEnum.MEDIA_STREAM)
export class ImageStreamStrategy implements MediaStreamStrategyInterface{  
  public readonly type: MediaTypeEnum = MediaTypeEnum.IMAGE;

  constructor(
    private readonly httpService: HttpService,
  ) { }
  
  public async streamMedia(
    url: string, 
    res: FastifyReply<any>, 
  ): Promise<void> {
    const response: any = await this.httpService.axiosRef({
        method: 'GET',
        responseType: 'stream',
        url: url,
    });
    res.header('Content-Type', response.headers['content-type']);
    res.send(response.data);
  }
}
