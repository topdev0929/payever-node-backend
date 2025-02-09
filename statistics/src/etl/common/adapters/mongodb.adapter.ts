/* eslint-disable @typescript-eslint/no-misused-promises */
import { Connection } from 'mongoose';
import { Db, MongoClient, Cursor } from 'mongodb';

import { DEFAULT_DB_CONNECTION } from '@nestjs/mongoose/dist/mongoose.constants';
import { Injectable, Inject, Logger } from '@nestjs/common';

import { MongodbOptionsInterface } from '../../interfaces';

async function *cursorToGenerator<T>(cursor: Cursor<T>): AsyncGenerator<T> {
  while (await cursor.hasNext()) {
    yield cursor.next();
  }
  await cursor.close();
}

@Injectable()
export class MongodbAdapter {
  private logger: Logger = new Logger('MongodbAdapter', true);
  constructor(
    @Inject(DEFAULT_DB_CONNECTION)
      private readonly connection: Connection,
  ) { }
  public async getData<T>(
    options: MongodbOptionsInterface<T>,
  ): Promise<AsyncGenerator<T>> {
    // eslint-disable-next-line @typescript-eslint/dot-notation
    const client: MongoClient = new MongoClient(this.connection['_connectionString']);
    await client.connect();

    const connectDB: Db = client.db(options.db);
    const data: Cursor<T> = connectDB
      .collection<T>(options.collection)
      .find(options.condition).sort(options.sort || { }).stream().batchSize(options.batchSize || 100);

    data.on('end', async () => {
      this.logger.log('Cursor end');
      await client.close();
    });
    data.on('close', async () => {
      this.logger.log('Cursor closed');
      await client.close();
    });
    data.on('error', async(err: Error) => {
      this.logger.error(err);
      await client.close();
    });

    return cursorToGenerator(data);
  }
}
