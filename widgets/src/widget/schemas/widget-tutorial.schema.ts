import { Schema } from 'mongoose';
import { v4 as uuid } from 'uuid';
import { MongooseModel } from '../../common/enums';

export const WidgetTutorialSchema: Schema = new Schema(
  {
    _id: { type: String, default: uuid },
    order: { type: Number },
    watched: { type: Boolean, default: false },
    widget: { type: Schema.Types.String, required: true, ref: MongooseModel.Widget },
  },
  {
    timestamps: { },
  },
);
