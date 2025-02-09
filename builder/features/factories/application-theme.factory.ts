import { partialFactory, PartialFactory } from '@pe/cucumber-sdk';
import * as uuid from 'uuid';

const defaultFactory: any = (): any => {
  return ({
    _id: uuid.v4(),
    application: null,
    isActive: false,
    theme: null,
  });
};

export class ApplicationThemeFactory {
  public static create: PartialFactory<any> = partialFactory<any>(defaultFactory);
}
