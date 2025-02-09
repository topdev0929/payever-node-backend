import { Schema } from 'mongoose';
import { v4 as uuidV4 } from 'uuid';

export const WidgetPropsSchemaName: string = 'WidgetProperties';
export const WidgetPropsSchema: Schema = new Schema(
  {
    _id: {
      default: uuidV4,
      type: Schema.Types.String,
    },
    props: Schema.Types.Mixed,
    widgetType: {
      type: Schema.Types.String,
    },
  },
  {
    timestamps: { },
  },
);
