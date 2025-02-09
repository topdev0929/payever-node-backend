import { AclInterface } from '@pe/nest-kit';

export interface Acl extends AclInterface {
  original?: AclInterface;
}
