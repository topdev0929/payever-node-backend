import {
  FindAndModifyWriteOpResultObject,
} from 'mongodb';
import { SchemaDefinition } from 'mongoose';
export type PopulatedVirtual<T> = T;
export type RefTo<T> = string;
export type UUID = string;
export type EntityInterfaceToMongooseDefinition<T> =
  Partial<Record<OptionalPropertyOf<T>, SchemaDefinition['any']>>
  &
  Omit<Record<keyof T, SchemaDefinition['any']>, OptionalPropertyOf<T>>;
export interface MongooseRawResult<T> extends FindAndModifyWriteOpResultObject<T> {
  lastErrorObject: {
      updatedExisting: boolean;
      upserted: any;
      n: number;
  };
}

type OptionalPropertyOf<T> = Exclude<{
  [K in keyof T]: T extends Record<K, T[K]>
  ? never
  : K
}[keyof T], undefined>;

export interface ESDocument {
  [key: string]: any;
}
