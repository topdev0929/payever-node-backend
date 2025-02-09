import { AclInterface } from '@pe/nest-kit';

export interface PatchGroupInterface {
  name?: string;
  $addToSet?: { acls: AclInterface[] };
}
