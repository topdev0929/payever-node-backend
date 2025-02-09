import { Schema } from 'mongoose';
import { v4 as uuid } from 'uuid';

export const PosTerminalSchemaName: string = 'PosTerminal';

export const PosTerminalSchema: Schema = new Schema(
  {
    _id: { type: String, default: uuid },
    active: Boolean,
    businessId: String,
    default: Boolean,
    logo: String,
    name: String,
  },
  {
    timestamps: true,
  },
).index({ businessId: 1, default: 1 });
