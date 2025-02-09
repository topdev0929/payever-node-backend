// tslint:disable:object-literal-sort-keys
import { Schema } from 'mongoose';
import Mixed = Schema.Types.Mixed;

export const CollectionProductFilterSchema: Schema = new Schema({
  field: String,
  fieldType: String,
  fieldCondition: String,
  value: String,
  filters: [Mixed],
});
