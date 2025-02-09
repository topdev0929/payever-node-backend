import * as uuid from 'uuid';
import { partialFactory, SequenceGenerator } from '@pe/cucumber-sdk';

const seq = new SequenceGenerator();

const defaultFactory = () => {
  seq.next();

  return {
    _id: uuid.v4(),
    fileUrl: `http://file_${seq.current}.url`,
    overwriteExisting: false,
    uploadedImages: [],
  };
};

export const fileImportFactory = partialFactory(defaultFactory);
