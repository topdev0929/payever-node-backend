import { FilterQuery, SortOptionObject } from 'mongodb';

export interface MongodbOptionsInterface<T> {
  collection: string;
  condition?: FilterQuery<T>;
  sort?: SortOptionObject<T>;
  db: string;
  target: string;
  batchSize?: number;
}
