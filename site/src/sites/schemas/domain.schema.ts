import { Schema } from 'mongoose';
import { v4 as uuid } from 'uuid';

import { SiteSchemaName } from './site.schema';

export const DomainSchemaName: string = 'Domain';
export const DomainSchema: Schema = new Schema({
    _id: {
        default: uuid,
        type: String,
    },
    isConnected: Boolean,
    name: String,
    provider: String,
    site: {
        ref: SiteSchemaName,
        type: String,
    },
}, {
    timestamps: true,
}).index({
    name: 1,
}, {
    unique: true,
});
