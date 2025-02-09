import { Schema } from 'mongoose';
import { SetupStatusEnum } from '../../apps/enums/setup-status.dto';

export const installedAppSchema: Schema = new Schema(
  {
    app: {
      ref: 'DashboardApp',
      type: String,
    },
    code: String,
    installed: {
      default: false,
      type: Boolean,
    },
    setupStatus: {
      default: SetupStatusEnum.NotStarted,
      enum: Object.keys(SetupStatusEnum).map((k: any): string => SetupStatusEnum[k] as string),
      type: String,
    },
    setupStep: String,
    statusChangedAt: Date,
  },
  {
    _id: false,
    collection: 'installedapps',
    timestamps: true,
  },
).index({ code: 1 });
