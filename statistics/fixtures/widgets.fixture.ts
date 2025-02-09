import {
  GranularityValueEnum,
  SizeValueEnum,
  ViewTypeValueEnum,
  WidgetSettingTypeEnum,
  WidgetTypeEnum
} from '../src/statistics/enums';

import { metricsFixture } from './metrics.fixture';
import { dimensionsFixture } from './dimensions.fixture';

const widgetsFixture = [{
  _id: 'db0c9b28-4899-4f9e-b7d6-bf35dfc2e0fd',
  type: WidgetTypeEnum.Transactions,
  dashboard: '1195ef09-1ec7-4159-87b0-f7fa0bb8373f',
  widgetSettings: [{
    type: WidgetSettingTypeEnum.Granularity,
    value: GranularityValueEnum.Month,
  }, {
    type: WidgetSettingTypeEnum.Size,
    value: SizeValueEnum.Small,
  }, {
    type: WidgetSettingTypeEnum.ViewType,
    value: ViewTypeValueEnum.DetailedNumbers,
  }, {
    type: WidgetSettingTypeEnum.DateTimeFrom,
    value: new Date('2018-01-01'),
  }, {
    type: WidgetSettingTypeEnum.DateTimeTo,
    value: new Date('2020-12-31'),
  }, {
    type: WidgetSettingTypeEnum.ViewType,
    value: ViewTypeValueEnum.DetailedNumbers,
  }],
}];

metricsFixture.forEach((metric: any) => {
  widgetsFixture[0].widgetSettings.push({
    type: WidgetSettingTypeEnum.Metric,
    value: metric._id,
  });
});

dimensionsFixture.forEach((dimension: any) => {
  widgetsFixture[0].widgetSettings.push({
    type: WidgetSettingTypeEnum.Dimension,
    value: dimension._id,
  });
});

export default widgetsFixture;
