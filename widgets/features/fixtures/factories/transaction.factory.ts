import {
  partialFactory,
  PartialFactory,
  DefaultFactory,
} from '@pe/cucumber-sdk';
import { v4 } from 'uuid';

export const transactionDefautFactory: DefaultFactory<any> = (): any => {
  return ({
    _id: v4(),
  });
};

export const transactionFactory: PartialFactory<any> = partialFactory<any>(transactionDefautFactory);
