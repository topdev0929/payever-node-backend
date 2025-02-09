import { Injectable, Logger } from '@nestjs/common';
import * as createEmitter from 'socket.io-emitter';

import { MessageNameEnum } from '../../ws/enums';
import { PushNotificationDto } from '../dto';
import { RedisClient } from '@pe/nest-kit';

@Injectable()
export class GlobalEventsProducer {
  // tslint:disable-next-line: typedef
  private emitter: any;
  private io: ReturnType<typeof createEmitter>;

  constructor(

    private readonly clientRedis: RedisClient,
    private readonly logger: Logger,
  ) {
    this.initEmitter();
  }

  public async sendPushNotification(pushNotification: PushNotificationDto): Promise<void> {
    this.io
      .emit(MessageNameEnum.PUSH_NOTIFICATION, pushNotification);
  }

  private initEmitter(): void {
    this.emitter = createEmitter(this.clientRedis.getClient());
    this.io = this.emitter.of('ws');
    this.emitter.redis.on('error', () => {
      this.initEmitter();
    });

    this.emitter.redis.on('error', (err: any) => {
      this.logger.error(err);
      process.exit(2);
    });
  }
}
