import { partialFactory, PartialFactory } from '@pe/cucumber-sdk';
import * as uuid from 'uuid';

const defaultFactory: any = (): any => {
  return ({
    _id: uuid.v4(),
    business: null,
  });
};

export class ApplicationFactory {
  public static create: PartialFactory<any> = partialFactory<any>(defaultFactory);
}
