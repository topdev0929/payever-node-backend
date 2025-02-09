import { Field } from '../../../src/appointments/schemas';
import * as uuid from 'uuid';
const id = uuid.v4();
const businessId = uuid.v4();

export const FieldMock: Field = {
    id: id,
    name: 'field name',
    businessId: businessId,
    title: 'field title',
    type: 'some type',
};
