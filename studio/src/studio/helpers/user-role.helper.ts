import { UserRoleInterface } from '@pe/nest-kit';

export class UserRoleHelper {
  public static isAdmin(roles: UserRoleInterface[]): boolean {
    for (const role of roles) {
      if (role.name === 'admin') {
        return true;
      }
    }

    return false;
  }
}
