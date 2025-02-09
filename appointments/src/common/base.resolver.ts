import { FilterQuery, Document } from 'mongoose';
import { ForbiddenException } from '@nestjs/common';
import { AbstractGqlResolver } from '@pe/graphql-kit';
import {
  AccessTokenPayload,
  UserRoleInterface,
  RolesEnum,
  UserRoleMerchant,
  PermissionInterface,
} from '@pe/nest-kit';
import { BusinessAccessValidator } from '@pe/nest-kit/modules/auth/access-validators/special';

interface DocumentWithBusiness extends Document {
  businessId: string;
}
export function getUserAllowedBusinesses(merchantRole: UserRoleMerchant): string[] {
  const userBusinesses: string[] =
    merchantRole.permissions?.map((permission: PermissionInterface) => permission.businessId) || [];

    return userBusinesses.filter(
      (businessId: string) => BusinessAccessValidator.isAccessAllowed(merchantRole, null, businessId),
    );
}

export function getUserBusinessFilterProto(user: AccessTokenPayload): string[] {
  const adminRole: UserRoleInterface =
    user.roles.find((role: UserRoleInterface) => role.name === RolesEnum.admin);

  const merchantRole: UserRoleMerchant = user.getRole(RolesEnum.merchant);

  if (adminRole) {
    return null;
  } else if (merchantRole) {
    return getUserAllowedBusinesses(merchantRole);
  } else {
    throw new ForbiddenException();
  }
}

export class BaseResolver extends AbstractGqlResolver {
  protected getAllowedBusinessesFilter<T extends DocumentWithBusiness>(
    user: AccessTokenPayload,
  ): FilterQuery<T> {
    const businesses: string[] = getUserBusinessFilterProto(user);
    if (!businesses) {
      return { };
    }

    return {
      businessId: {
        $in: businesses,
      },
    } as FilterQuery<DocumentWithBusiness> as FilterQuery<T>;
  }
}
