// tslint:disable: object-literal-sort-keys
import { Injectable } from '@nestjs/common';
import { Document, Model, DocumentDefinition, UpdateQuery, Query, FilterQuery, EnforceDocument } from 'mongoose';

import { EventDispatcher } from '@pe/nest-kit';
import { MongooseRawResult } from './types';

type EventCodes = {
  created?: string;
  updated?: string;
  deleted?: string;
};

@Injectable()
export abstract class BaseModelService<T extends Document> {
  constructor(
    protected readonly model: Model<T>,
    protected readonly eventDispatcher: EventDispatcher,
    private readonly eventCodes: EventCodes = { },
  ) { }

  public getModel(): Model<T> {
    return this.model;
  }

  public async create(data: DocumentDefinition<T>): Promise<T> {
    const model: T = await this.model.create(data);

    if (this.eventCodes.created) {
      await this.eventDispatcher.dispatch(this.eventCodes.created, model);
    }

    return model;
  }

  public findById(id: string): Query<EnforceDocument<T, { }>, EnforceDocument<T, { }>, { }, T> {
    return this.model.findById(id);
  }

  public find(filter: FilterQuery<T>): Query<Array<EnforceDocument<T, { }>>, EnforceDocument<T, { }>, { }, T> {
    return this.model.find(filter);
  }

  public findOne(filter: FilterQuery<T>): Query<EnforceDocument<T, { }>, EnforceDocument<T, { }>, { }, T> {
    return this.model.findOne(filter);
  }

  public async findByIdOrCreate(data: UpdateQuery<T> & { _id: string }): Promise<T> {
    const operationRawResult: MongooseRawResult<T> = (await this.model.findByIdAndUpdate(data._id, data, {
      new: true,
      upsert: true,
      setDefaultsOnInsert: true,
      rawResult: true,
    })) as any;

    const document: T = operationRawResult.value;

    if (!operationRawResult.lastErrorObject.updatedExisting && this.eventCodes.created) {
      await this.eventDispatcher.dispatch(this.eventCodes.created, document);
    }

    return document;
  }

  public async findOrCreate(query: FilterQuery<T>, prototype: UpdateQuery<T>): Promise<T> {
    const operationRawResult: MongooseRawResult<T> = (await this.model.findOneAndUpdate(query, prototype, {
      new: true,
      upsert: true,
      setDefaultsOnInsert: true,
      rawResult: true,
    })) as any;

    const document: T = operationRawResult.value;

    if (!operationRawResult.lastErrorObject.updatedExisting && this.eventCodes.created) {
      await this.eventDispatcher.dispatch(this.eventCodes.created, document);
    }

    return document;
  }

  public async updateById(data: UpdateQuery<T> & { _id: string }): Promise<T> {
    const existing: T = await this.model.findById(data._id);

    return this.updateOne(existing, data);
  }

  public async updateOneByFilter(filter: FilterQuery<T>, data: UpdateQuery<T>): Promise<T> {
    const existing: T = await this.model.findOne(filter);

    return this.updateOne(existing, data);
  }

  public async updateOne(existing: T, data: UpdateQuery<T>): Promise<T> {
    if (!existing) {
      return null;
    }
    const updated: T = await this.model.findByIdAndUpdate(existing._id, data, {
      new: true,
    });

    if (this.eventCodes.updated) {
      await this.eventDispatcher.dispatch(this.eventCodes.updated, updated, existing);
    }

    return updated;
  }

  public async upsertById(data: UpdateQuery<T> & { _id: string }): Promise<T> {
    const modelRawResult: MongooseRawResult<T> = (await this.model.findByIdAndUpdate(data._id, data, {
      upsert: true,
      new: true,
      rawResult: true,
    })) as any;

    const model: T = modelRawResult.value;

    if (model) {
      if (modelRawResult.lastErrorObject.updatedExisting === true) {
        if (this.eventCodes.updated) {
          await this.eventDispatcher.dispatch(this.eventCodes.updated, model);
        }
      } else {
        if (this.eventCodes.created) {
          await this.eventDispatcher.dispatch(this.eventCodes.created, model);
        }
      }
    }

    return model;
  }

  public async removeById(_id: string): Promise<T> {
    const model: T = await this.model.findByIdAndDelete(_id);

    if (this.eventCodes.deleted) {
      await this.eventDispatcher.dispatch(this.eventCodes.deleted, model);
    }

    return model;
  }

  public async removeByFilter(filter: FilterQuery<T>): Promise<string[]> {
    const itemsToDelete: T[] = await this.find(filter);
    for (const item of itemsToDelete) {
      await this.removeById(item._id);
    }

    return itemsToDelete.map((item: T) => item._id);
  }

  public async count(filter: any): Promise<any> {
    return this.model.count(filter);
  }
}
