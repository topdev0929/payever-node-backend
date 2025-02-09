import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { isPartnerRoleInterface, PartnerTagName, RolesEnum, UserRoleInterface, UserRolePartner } from '@pe/nest-kit';
import { Model } from 'mongoose';

import { UserSchemaName } from '../../users/schemas';
import { User } from '../../users/interfaces';
import { PartnerRole } from '../interfaces';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(UserSchemaName) private readonly userModel: Model<User>,
  ) { }

  public async assignTag(user: User, tagName: PartnerTagName): Promise<void> {
    const partnerRole: UserRoleInterface = UserService.upsertPartnerRole(user);
    if (!UserService.isPartnerRole(partnerRole)) {
      return;
    }

    partnerRole.addPartnerTag(tagName);
    await user.save();
  }

  public async removeTag(user: User, tagName: PartnerTagName): Promise<void> {
    const partnerRole: UserRoleInterface = user.getRole(RolesEnum.partner);
    if (!UserService.isPartnerRole(partnerRole)) {
      return;
    }

    partnerRole.removePartnerTag(tagName);
    await user.save();
  }

  private static isPartnerRole(role?: UserRoleInterface): role is PartnerRole {
    return isPartnerRoleInterface(role);
  }

  private static upsertPartnerRole(user: User): UserRoleInterface {
    const partnerRole: UserRoleInterface = user.getRole(RolesEnum.partner);
    if (partnerRole) {
      return partnerRole;
    }

    const newPartnerRole: UserRolePartner = {
      name: RolesEnum.partner,
      partnerTags: [],
    };

    user.roles.push(newPartnerRole);

    return user.getRole(RolesEnum.partner);
  }
}
