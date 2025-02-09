import {
  FindAndModifyWriteOpResultObject,
} from 'mongodb';


export interface MongooseRawResult<T> extends FindAndModifyWriteOpResultObject<T> {
  lastErrorObject: {
    updatedExisting: boolean;
    upserted: any;
    n: number;
  };
}
