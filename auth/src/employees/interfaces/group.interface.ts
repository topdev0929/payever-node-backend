import { Document } from 'mongoose';

import { AclInterface } from '@pe/nest-kit';

import { Employee } from '.';

export interface Group extends Document {
  name: string;
  businessId: string;
  employees?: Employee[] | string[];
  acls?: AclInterface[];
  toObject: () => any;
}
