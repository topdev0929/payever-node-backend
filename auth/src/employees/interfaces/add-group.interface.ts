import { AclInterface } from '@pe/nest-kit';

export interface AddGroupInterface {
  name: string;
  acls?: AclInterface[];
}
