import { SchemaOptions } from 'mongoose';

export const couponTypeSchemaOptions: SchemaOptions = {
    _id: false,
    discriminatorKey: 'type',
};
