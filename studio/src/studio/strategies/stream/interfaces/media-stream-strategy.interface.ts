import { FastifyReply } from 'fastify';
import { MediaTypeEnum } from '../../../enums';

export interface MediaStreamStrategyInterface {
  type: MediaTypeEnum;
  streamMedia: (
    url: string, 
    res: FastifyReply<any>, 
    range: string,
  ) => Promise<void>;
}
