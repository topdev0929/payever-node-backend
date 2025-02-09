import { Schema } from 'mongoose';
import { v4 as uuid } from 'uuid';
import { MongooseModel } from '../../common/enums';

export const WidgetInstallationSchema: Schema = new Schema(
  {
    _id: { type: String, default: uuid },
    installed: { type: Boolean, default: false },
    order: { type: Number },
    widget: { type: Schema.Types.String, required: true, ref: MongooseModel.Widget },
  },
  {
    timestamps: { },
  },
);
