// tslint:disable:object-literal-sort-keys
import { Schema } from 'mongoose';
import { v4 as uuid } from 'uuid';
import Mixed = Schema.Types.Mixed;

export const TrainedDataSchemaName: string = 'TrainedData';
export const TrainedDataSchema: Schema = new Schema(
  {
    _id: { type: String, default: uuid },
    modelTag: String,
    modelTopology: Mixed,
    format: String,
    generatedBy: String,
    convertedBy: String,
    weightData: Buffer,
    weightSpecs: [Mixed],
  },
  { timestamps: true },
);

TrainedDataSchema.index({ modelTag: 1});
