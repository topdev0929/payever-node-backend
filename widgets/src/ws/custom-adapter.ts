import { INestApplicationContext } from '@nestjs/common';
import { ServerOptions, Server } from 'socket.io';
import * as redisAdapter from 'socket.io-redis';
import { IoAdapter } from '@nestjs/platform-socket.io';
import { RedisClient } from '@pe/nest-kit';
import { Cluster } from 'ioredis';

export class RedisIoAdapter extends IoAdapter {
  constructor(
    protected readonly app: INestApplicationContext,
    protected readonly port: number,
  ) {
    super(app);
  }
  public createIOServer(port: number, options?: ServerOptions): Server {
    const server: Server = super.createIOServer(port || this.port, options);
    const redisClient: Cluster = this.app.get(RedisClient).getClient();
    const pubClient: Cluster = redisClient.duplicate();
    const subClient: Cluster = redisClient.duplicate();
    server.adapter(redisAdapter({
      pubClient,
      subClient,
    }));

    return server;
  }
}
