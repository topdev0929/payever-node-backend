import { partialFactory, PartialFactory } from '@pe/cucumber-sdk';
import * as uuid from 'uuid';

const defaultFactory: any = (): any => {
  return ({
    _id: uuid.v4(),
    code: 'BRANCHE_FASHION',
    themes: [],
  });
};

export class TemplateThemeItemFactory {
  public static create: PartialFactory<any> = partialFactory<any>(defaultFactory);
}
