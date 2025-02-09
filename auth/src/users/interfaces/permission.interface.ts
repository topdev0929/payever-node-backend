import { PermissionInterface } from '@pe/nest-kit';
import { Acl } from './acl.interface';

export interface Permission extends PermissionInterface {
  acls: Acl[];
  role: string;
  userId: string;
  hasAcls(): boolean;
}
