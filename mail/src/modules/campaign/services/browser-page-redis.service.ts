import { Injectable, Logger } from '@nestjs/common';
import * as dotenv from 'dotenv';
import * as redis from 'redis';
import ProcessEnv = NodeJS.ProcessEnv;

dotenv.config();
const env: ProcessEnv = process.env;

const mainLockKey: string = 'main-browser-page-lock';

const poolTimeout: number = env.POOL_TIMEOUT && parseInt(env.POOL_TIMEOUT, 10) ?
  parseInt(env.POOL_TIMEOUT, 10) : 3600;

@Injectable()
export class BrowserPageRedisService {
  constructor(
    private readonly redisUrl: string,
    private readonly logger: Logger,
  ) {
  }

  public client(): any {
    const client: any = redis.createClient(this.redisUrl);
    client.on('error', (err: any) => this.logger.error('Redis Client Error', err));
    client.on('connect', (err: any) => this.logger.log('Redis Client Connected', err));

    return client;
  }

  public async setPoolKeyTimeout(key: string): Promise<any> {
    const redisClient: any = this.client();

    return new Promise((resolve: any, reject: any) => {
      return redisClient.set(`poolKey-${key}`, 1, 'EX', poolTimeout, async (error: any, data: any) => {
        redisClient.quit();
        if (error) {
          reject(error);
        }
        resolve(data);
      });
    });
  }

  public async getPoolKey(key: string): Promise<any> {
    const redisClient: any = this.client();

    return new Promise((resolve: any, reject: any) => {
      return redisClient.get(`poolKey-${key}`, async (err: any, data: any) => {
        redisClient.quit();
        if (err) {
          reject(err);
        }
        resolve(data);
      });
    });
  }

  public async lock(key: string = mainLockKey): Promise<string> {
    const redisClient: any = this.client();
    const set: any = await new Promise((resolve: any, reject: any) => {
      return redisClient.set(key, 1, 'NX', 'EX', 60, async (error: any, setData: any) => {
        redisClient.quit();
        if (error) {
          reject(error);
        }
        resolve(setData);
      });
    });

    return set && set === 'OK' ? key : null;
  }

  public async unlock(key: string = mainLockKey): Promise<any> {
    const redisClient: any = this.client();

    return new Promise((resolve: any, reject: any) => {
      return redisClient.del(key, async (error: any, del: any) => {
        redisClient.quit();
        if (error) {
          reject(error);
        }

        resolve(del);
      });
    });
  }
}
