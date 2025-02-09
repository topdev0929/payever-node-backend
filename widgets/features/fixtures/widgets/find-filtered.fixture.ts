import { combineFixtures, fixture, BaseFixture } from '@pe/cucumber-sdk';
import { Type } from '@nestjs/common';

import { WidgetModel } from '../../../src/widget';
import { widgetFactory } from '../factories/widget.factory';
import { BusinessModel } from '../../../src/business/models';
import { businessFactory } from '../factories/business.factory';

const businessFixture: Type<BaseFixture> = fixture<BusinessModel>('BusinessModel', businessFactory, [
  {
    _id: '3b8e9196-ccaa-4863-8f1e-19c18f2e4b99',
  },
]);

const widgetsFixture: Type<BaseFixture> = fixture<WidgetModel>('WidgetModel', widgetFactory, [
  {
    _id: '25e394f9-a596-4410-9403-4d111420b1c8',
    title: 'Widget 1',
  },
  {
    _id: '358ada94-6559-4f92-9cdc-077ea46bc3d7',
    type: 'Widget 2',
  },
  {
    _id: 'e62b4849-b946-49ce-b863-7bcb7e8b978b',
    type: 'Widget 3',
  },
]);

export = combineFixtures(businessFixture, widgetsFixture);
