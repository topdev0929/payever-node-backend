import { partialFactory, PartialFactory } from '@pe/cucumber-sdk';
import * as uuid from 'uuid';

const defaultFactory: any = (): any => {
  return ({
    _id: uuid.v4(),
    code: 'BUSINESS_PRODUCT_RETAIL_B2C',
    items: [],
    order: 1,
  });
};

export class TemplateThemeGroupFactory {
  public static create: PartialFactory<any> = partialFactory<any>(defaultFactory);
}
