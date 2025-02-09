import { Schema } from 'mongoose';
import { WidgetSettingTypeEnum } from '../enums';

export const WidgetSettingSchemaName: string = 'WidgetSetting';
export const WidgetSettingSchema: Schema = new Schema(
  {
    type: {
      required: true,
      type: WidgetSettingTypeEnum,
    },
    value: {
      required: true,
      type: Schema.Types.Mixed,
    },
  },
  {
    timestamps: { },
  },
);
