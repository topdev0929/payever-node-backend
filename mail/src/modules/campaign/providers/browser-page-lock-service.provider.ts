import { BrowserPageRedisService } from '../services';
import { Logger } from '@nestjs/common';

export const BrowserPageLockServiceProvider: any = (RedisUrl: string) => {
  return {
    inject: [Logger],
    provide: BrowserPageRedisService,
    useFactory: (logger: Logger) => {
      return new BrowserPageRedisService(RedisUrl, logger);
    },
  };
};
