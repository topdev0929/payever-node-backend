import { Schema } from 'mongoose';
import { v4 as uuid } from 'uuid';
import { MongooseModel } from '../../common/enums';

export const UserSchema: Schema = new Schema(
  {
    _id: { type: String, default: uuid },
    currency: { type: String, default: 'EUR' },
    installations: [{
      ref: MongooseModel.WidgetInstallation,
      required: true,
      type: Schema.Types.String,
    }],
    tutorials: [{
      ref: MongooseModel.WidgetTutorial,
      required: true,
      type: Schema.Types.String,
    }],
  },
  {
    timestamps: { },
  },
);
