import { Schema, SchemaDefinition, SchemaOptions } from 'mongoose';

export function extendSchema(
  sourceSchema: Schema,
  definition?: SchemaDefinition<any>,
  options?: SchemaOptions,
): Schema {
  return new Schema(
    Object.assign({ }, sourceSchema.obj, definition),
    options,
  );
}
