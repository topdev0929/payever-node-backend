import { DefaultFactory, PartialFactory, partialFactory } from '@pe/cucumber-sdk';
import * as uuid from 'uuid';
import { RecordInterface } from '../../src/storage/interfaces/record.interface';

type RecordType = RecordInterface & { _id: string };

const LocalFactory: DefaultFactory<RecordType> = (): RecordType => {
  return {
    _id: uuid.v4(),
    data: {},
  };
};

export class RecordFactory {
  public static create: PartialFactory<RecordType> = partialFactory<RecordType>(LocalFactory);
}
