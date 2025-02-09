/* tslint:disable:object-literal-sort-keys */
import { Schema } from 'mongoose';
import { CheckoutSchemaName } from './checkout.schema';

export const TerminalSchemaName: string = 'Terminal';

export const TerminalSchema: Schema = new Schema(
  {
    name: String,
    businessId: String,
    terminalId: String,
    checkout: {
      ref: CheckoutSchemaName,
      type: String,
    },
    channelSetId: String,
  },
  {
    collection: 'terminals',
  },
);

TerminalSchema.index({ businessId: 1 }, { unique: false });
TerminalSchema.index({ terminalId: 1 }, { unique: true });
TerminalSchema.index({ channelSetId: 1 }, { unique: true });
