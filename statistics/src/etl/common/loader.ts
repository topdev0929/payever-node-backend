import { Injectable } from '@nestjs/common';

import { SourceEnum } from '../enums';
import { MongodbAdapter } from './adapters/';

@Injectable()
export class Loader {
  constructor(
    private readonly mongodb: MongodbAdapter,
  ) { }

  public getData<T>(source: SourceEnum, options: any = { }): Promise<AsyncGenerator<T>> {
    return this.getAdapter(source).getData(options);
  }

  public getAdapter(source: SourceEnum): MongodbAdapter {
    let adapter: MongodbAdapter;

    if (source === SourceEnum.Mongodb) {
      adapter = this.mongodb;
    } else {
      throw new Error('Adapter error.');
    }

    return adapter;
  }
}
