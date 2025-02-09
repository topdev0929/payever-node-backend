import { Schema } from 'mongoose';

export const InstalledAppSchema: Schema = new Schema(
  {
    app: {
      ref: 'DashboardApp',
      type: Schema.Types.String,
    },
    code: {
      type: Schema.Types.String,
    },
    installed: {
      default: false,
      type: Schema.Types.Boolean,
    },
    setupStatus: {
      type: Schema.Types.String,
    },
    setupStep: {
      type: Schema.Types.String,
    },
    statusChangedAt: {
      type: Schema.Types.Date,
    },
  },
  {
    _id: false,
    collection: 'installedapps',
    timestamps: true,
  },
).index({ code: 1 });
