import * as uuid from 'uuid';
import { DocumentDefinition } from 'mongoose';
import { partialFactory, SequenceGenerator, PartialFactory } from '@pe/cucumber-sdk';
import { FileImportModel } from '@pe/synchronizer-kit';

const seq = new SequenceGenerator();

const defaultFactory = () => {
  seq.next();

  return {
    _id: uuid.v4(),
    fileUrl: `http://file_${seq.current}.url`,
    overwriteExisting: false,
  };
};

export const fileImportFactory: PartialFactory<DocumentDefinition<FileImportModel>> = partialFactory(defaultFactory);
