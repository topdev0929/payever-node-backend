import { HttpService, Injectable } from '@nestjs/common';
import { ServiceTag } from '@pe/nest-kit/modules/collector-pattern';
import { FastifyReply } from 'fastify';
import { MediaTypeEnum, ServiceTagEnum } from '../../enums';
import { MediaStreamStrategyInterface, VideoHeaderInterface } from './interfaces';

@Injectable()
@ServiceTag(ServiceTagEnum.MEDIA_STREAM)
export class VideoStreamStrategy implements MediaStreamStrategyInterface{  
  public readonly type: MediaTypeEnum = MediaTypeEnum.VIDEO;

  constructor(
    private readonly httpService: HttpService,
  ) { }
  
  public async streamMedia(
    url: string, 
    res: FastifyReply<any>, 
    range: string,
  ): Promise<void> {
    const videoHeaderInfo: VideoHeaderInterface = await this.generateVideoHeader(url, range);

    if (videoHeaderInfo.size !== 0) {
      const response: any = await this.httpService.axiosRef({
        headers: { 'Range': `bytes=${videoHeaderInfo.start}-` },
        method: 'GET',
        responseType: 'stream',  
        url: url,
      });
      res.header('Content-Type', response.headers['content-type']);
      res.status(response.status);
      res.header('Content-Length', `${videoHeaderInfo.size}`);
      res.header('Content-Range', `bytes ${videoHeaderInfo.start}-${videoHeaderInfo.end}/${videoHeaderInfo.total}`);
      res.header('Accept-Ranges', 'bytes');
      res.send(response.data);
    } else {
      res.status(200);
      res.send();
    }
  }

  private async generateVideoHeader(
    url: string,
    range: string,
  ): Promise<VideoHeaderInterface> {
    const header: any = await this.httpService.axiosRef({
      method: 'HEAD',
      url: url,
    });
    const total: number = parseInt(header.headers['content-length'], 10);
    const parts: any[] = range ? range.replace(/bytes=/, '').split('-') : [0, total];
    const start: number = parseInt(parts[0], 10);
    const chunkSize: number = 10485760;
    let end: number = parts[1] ? parseInt(parts[1], 10) : (start + chunkSize);
    end = (end >= total) ? (total - 1) : end;
    const size: number = (end - start);

    return {
      end: end,
      size: size,
      start: start,
      total: total,
    };
  }
}
