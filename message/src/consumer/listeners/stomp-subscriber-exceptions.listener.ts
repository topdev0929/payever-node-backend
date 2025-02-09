import { v4 as uuid } from 'uuid';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { IMessage } from '@stomp/stompjs';
import { EventListener } from '@pe/nest-kit';

import { FailedFrameSchemaName } from '../schemas';
import { FailedFrameDocument } from '../models';

@Injectable()
export class StompSubscriberExceptionsListener {
  constructor(
    @InjectModel(FailedFrameSchemaName)
      private readonly failedFramesModel: Model<FailedFrameDocument>,
  ) { }

  @EventListener('stomp.subscriber.exception')
  public async create(err: any, message: IMessage): Promise<void> {
    await this.failedFramesModel.create({
      _id: message.headers?.['message-id'] || uuid(),
      err,
      message,
    });
  }
}
