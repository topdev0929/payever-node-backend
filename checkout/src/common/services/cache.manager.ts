/* eslint-disable @typescript-eslint/dot-notation */
import { Injectable, Logger } from '@nestjs/common';
import { RedisClient } from '@pe/nest-kit';

@Injectable()
export class CacheManager {
  constructor(
    private readonly redisClient: RedisClient,
    private readonly logger: Logger,
  ) { }

  public async getData(
    key: string,
  ): Promise<string> {
    try {
      return await this.redisClient.get(key);
    } catch (e) {
      this.logger.log({
        error: e.message,
        key,
        message: 'Failed to get checkout cached data from redis',
      });
    }

    return null;
  }

  public async setData(
    key: string,
    value: string,
    ttl: number,
  ): Promise<void> {
    try {
      await this.redisClient.set(key, value, 'EX', ttl);
    } catch (e) {
      this.logger.log({
        error: e.message,
        key,
        message: 'Failed to save checkout cached data to redis',
      });
    }
  }

  public async removeData(
    key: string,
  ): Promise<void> {
    try {
      await this.redisClient.del(key);
    } catch (e) {
      this.logger.log({
        error: e.message,
        key,
        message: 'Failed to delete checkout cached data from redis',
      });
    }
  }

  public async deleteKeysByPattern(pattern: string): Promise<void> {
    try {
      if (typeof this.redisClient['deleteKeysByPattern'] === 'function') {
        await this.redisClient['deleteKeysByPattern'](pattern);
      } else {
        await this.redisClient['deleteAllByPattern'](pattern);
      }
    } catch (e) {
      this.logger.log({
        error: e.message,
        message: 'Failed to delete checkout cached data by pattern',
        pattern,
      });
    }
  }
}
