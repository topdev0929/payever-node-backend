import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, FilterQuery } from 'mongoose';

import {
  AclInterface,
  EventDispatcher,
  isMerchantRoleInterface,
  Mutex,
  PermissionInterface,
  RolesEnum,
  UserRoleInterface,
  UserRoleMerchant,
  UserRoleTypes,
} from '@pe/nest-kit';
import { Acl, User } from '../interfaces';
import { UserFilters } from '../interfaces/user-filters.interface';
import { BusinessPermissionEventProducer } from '../producer';
import { PermissionModel } from '../models/permission.model';
import { PermissionService } from './permission.service';
import { defaultCommercesOsGroup } from '../../employees/constants';
import { UpdatePermissionDto } from '../dto/update-permission.dto';
import { ACL_UPDATED_EVENT } from '../../common';
import { AclDto, ApproveRegistrationDto } from '../dto';
import { BusinessService } from '@pe/business-kit';
import { BusinessLocalDocument } from '../../business/schemas';

@Injectable()
export class UserService {
  constructor(
    @InjectModel('User') private readonly userModel: Model<User>,
    private readonly permissionService: PermissionService,
    private readonly businessPermissionEventProducer: BusinessPermissionEventProducer,
    private readonly mutex: Mutex,
    private readonly eventDispatcher: EventDispatcher,
    private readonly businessService: BusinessService<BusinessLocalDocument>,
  ) { }

  public async getAll(): Promise<User[]> {
    return this.userModel.find({ });
  }

  public async checkEmailUnique(email: string): Promise<boolean> {
    return null === (await this.userModel.findOne({ email }).collation({ locale: 'en_US', strength: 2 }).exec());
  }

  public async find(conditions: FilterQuery<User>): Promise<User[]> {
    return this.userModel.find(conditions);
  }

  public async findOneBy(conditions: FilterQuery<User>): Promise<User> {
    return this.userModel.findOne(conditions);
  }

  public async findOneByEmail(email: string): Promise<User> {
    return this.userModel.findOne({ email: email }).collation({ locale: 'en_US', strength: 2 });
  }

  public async findByFilters(
    filters: UserFilters,
    limit: number = 100,
  ): Promise<
    Array<{
      id: string;
      email: string;
      firstName: string;
      lastName: string;
    }>
  > {
    let aggregate: any[] = [];
    if (filters.email) {
      const escape: (s: string) => string = (s: string): string => {
        return s.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
      };

      aggregate.push({ $match: { email: new RegExp(escape(filters.email), 'ig') } });
    }

    if (filters.roles) {
      aggregate = aggregate.concat({
        $match: {
          'roles.name': {
            $in: filters.roles,
          },
        },
      });
    }

    aggregate = aggregate.concat([
      { $sort: { email: 1 } },
      { $limit: limit },
      { $project: { id: '$_id', email: '$email', firstName: '$firstName', lastName: '$lastName' } },
    ]);

    return this.userModel.aggregate(aggregate);
  }

  public async remove(userId: string): Promise<User> {
    return this.userModel.findByIdAndRemove(userId);
  }

  public async update(userId: string, dto: User): Promise<void> {
    await this.userModel.updateOne(
      { _id: userId },
      {
        $set: {
          ...dto,
        },
      },
    ).exec();
  }

  public async populatePermissions(user: User): Promise<UserRoleInterface[]> {
    const roles: any[] = [];
    for (const role of user.roles) {
      roles.push({
        name: role.name,
        permissions: await this.permissionService.find({ userId: user._id, role: role.name }),
      });
    }

    return roles;
  }

  public async findAndPopulateWithBusiness(userId: string, businessId: string): Promise<User> {
    const user: User = await this.findOneBy({ _id: userId });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    if (user.isAdmin()) {
      user.roles = user.roles.map(
        (role: UserRoleMerchant) => {
          role.permissions = [];

          return role;
        },
      );

      return user;
    }

    const permission: PermissionModel = await this.permissionService.findOneBy({ userId, businessId });

    if (!permission) {
      throw new ForbiddenException('User does not permission for given business');
    }

    const roleIndex: number = user.roles.findIndex(
      (role: UserRoleMerchant) =>
        role.name === RolesEnum.merchant && role.permissions && role.permissions.includes(permission._id),
    );

    if (roleIndex === -1) {
      return user;
    }

    user.roles[roleIndex] = {
      name: RolesEnum.merchant,
      permissions: [
        {
          acls: permission.acls,
          businessId,
        },
      ],
    } as any;

    return user;
  }

  public async assignPermissions(
    userId: string,
    businessId: string,
    acls: Acl[],
  ): Promise<User> {
    return this.mutex.lock('User', userId, async () => {
      const user: User = await this.findOneBy({ _id: userId });
      if (!user) {
        return null;
      }

      const permission: PermissionModel = await this.getBusinessPermission(userId, businessId);
      acls = permission.acls.reduce(
        (aclArray: Acl[], acl: Acl) => {
          if (aclArray.some((item: Acl) => item.microservice === acl.microservice)) {
            return aclArray;
          }

          return [
            ...aclArray,
            acl,
          ];
        },
        acls,
      );

      await this.permissionService.update(permission._id, { acls } as any);

      await this.businessPermissionEventProducer.produceBusinessPermissionAddedEvent(userId, businessId);

      if (!user.roles.some((role: UserRoleTypes) => role.name === RolesEnum.merchant)) {
        return this.userModel.findOneAndUpdate(
          { _id: user._id },
          { $addToSet: { roles: { name: RolesEnum.merchant, permissions: [permission._id] } } },
          { new: true },
        );
      } else {
        return this.userModel.findOneAndUpdate(
          { _id: user._id },
          { $addToSet: { 'roles.$[elem].permissions': permission._id } },
          {
            arrayFilters: [{ 'elem.name': RolesEnum.merchant }],
            new: true,
          },
        );
      }
    });
  }

  public async removePermissionsFromRole(userId: string, businessId: string): Promise<User> {
    const user: User = await this.findOneBy({ _id: userId });
    if (!user) {
      return null;
    }

    const permission: PermissionModel = await this.permissionService.findByBusinessId(businessId, userId);

    if (!permission) {
      return user;
    }

    await this.permissionService.update(permission._id, { acls: [] } as any);


    const userUpdated: User = await this.userModel.findOneAndUpdate(
      { _id: user._id },
      { $pull: { 'roles.$[elem].permissions': permission._id } },
      {
        arrayFilters: [{ 'elem.name': RolesEnum.merchant }],
        new: true,
      },
    );

    await this.businessPermissionEventProducer.produceBusinessPermissionDeletedEvent(userId, businessId);

    return userUpdated;
  }

  public async removePermissions(userId: string, businessId: string, aclsToRemove: Acl[]): Promise<User> {
    const user: User = await this.findOneBy({ _id: userId });
    if (!user) {
      return null;
    }

    const permission: PermissionModel =
      await this.permissionService.findOneBy({ businessId, userId, role: RolesEnum.merchant });
    if (!permission) {
      return user;
    }

    aclsToRemove.forEach((aclToRemove: Acl) => {
      const userAcl: Acl = permission.acls.find(
        (_acl: Acl) => _acl.microservice === aclToRemove.microservice,
      );
      if (userAcl) {
        for (const _permission in aclToRemove) {
          if (_permission !== 'microservice' && userAcl[_permission] && !aclToRemove[_permission]) {
            userAcl[_permission] = false;
          }
        }
      }
    });

    await this.businessPermissionEventProducer.produceBusinessPermissionDeletedEvent(userId, businessId);

    await this.permissionService.update(permission._id, { acls: permission.acls } as any);

    return user;
  }

  public async addOnBoardingPermissions(
    user: User,
    businessId: string,
    appCode: string[],
  ): Promise<User> {
    return this.addPermissions(
      user._id,
      businessId,
      appCode.map((microservice: string) => ({ microservice })),
    );
  }

  public async updateUserPermissions(
    userId: string,
    permissions: UpdatePermissionDto[],
  ): Promise<void> {
    const user: User = await this.findOneBy({ _id: userId });

    for (const permission of permissions) {
      const permissionModel: PermissionModel =
        await this.permissionService.findOneBy({
          businessId: permission.businessId,
          userId,
        });

      const targetAcls: AclDto[] = permission.acls.filter(
        (acl: AclDto) => permissionModel.acls.some(
          (pmAcls: Acl) => pmAcls.microservice === acl.microservice,
        ),
      );

      await this.permissionService.update(permissionModel._id, { acls: targetAcls } as any);
      await this.eventDispatcher.dispatch(ACL_UPDATED_EVENT, [user], permission.businessId);
    }
  }

  public async updatePermissions(
    user: User,
    businessId: string,
    appCode: string[],
    install: boolean = false,
    isAdmin: boolean = false,
  ): Promise<User> {
    return this.mutex.lock('User', user._id, async () => {

      const permission: PermissionModel = await this.updateAclsByBusiness(
        user._id,
        install,
        businessId,
        appCode,
        isAdmin,
      );

      this.businessPermissionEventProducer.produceBusinessPermissionAddedEvent(user._id, businessId).catch();

      return this.userModel.findOneAndUpdate(
        { _id: user._id },
        { $addToSet: { 'roles.$[elem].permissions': permission._id } },
        {
          arrayFilters: [{ 'elem.name': RolesEnum.merchant }],
          new: true,
        },
      );
    });
  }

  public async addPermissions(
    userId: string,
    businessId: string,
    aclsToAdd: Acl[],
  ): Promise<User> {
    return this.mutex.lock('User', userId, async () => {
      const user: User = await this.findOneBy({ _id: userId });
      if (!user) {
        return null;
      }

      const permission: PermissionModel = await this.getBusinessPermission(user._id, businessId);
      const acls: AclInterface[] = aclsToAdd.map((acl: Acl) => {
        return { create: true, delete: true, microservice: acl.microservice, read: true, update: true };
      });
      await this.permissionService.update(permission._id, { acls } as any);

      await this.businessPermissionEventProducer.produceBusinessPermissionAddedEvent(userId, businessId);

      if (!user.roles.some((role: UserRoleTypes) => role.name === RolesEnum.merchant)) {
        return this.userModel.findOneAndUpdate(
          { _id: user._id },
          { $addToSet: { roles: { name: RolesEnum.merchant, permissions: [permission._id] } } },
          { new: true },
        );
      } else {
        return this.userModel.findOneAndUpdate(
          { _id: user._id },
          { $addToSet: { 'roles.$[elem].permissions': permission._id } },
          {
            arrayFilters: [{ 'elem.name': RolesEnum.merchant }],
            new: true,
          },
        );
      }

    });
  }

  public async isOwner(userId: string, businessId: string): Promise<boolean> {
    if (!businessId) {
      return false;
    }
    const business: BusinessLocalDocument = await this.businessService.findOneById(businessId);

    if (!business) {
      return false;
    }

    if (business.owner === userId) {
      return true;
    }
  }

  public async assignAbsolutePermissions(userId: string, businessId: string): Promise<User> {
    const existingBusinessOwner: User | null = await this.userModel.findOne({
      roles: {
        $elemMatch: {
          permissions: {
            $elemMatch: {
              acls: { $exists: true, $size: 0 },
              businessId,
            },
          },
          type: RolesEnum.merchant,
        },
      },
    }).exec();

    if (existingBusinessOwner && await this.sameBusinessOwner(existingBusinessOwner, userId, businessId)) {
      throw new ForbiddenException("You're not allowed to register this business");
    }

    const absolutePermissionsAcls: any[] = [defaultCommercesOsGroup];
    await this.assignPermissions(userId, businessId, absolutePermissionsAcls);

    return this.findOneBy({ _id: userId });
  }

  public async removePermissionsForBusiness(businessId: string): Promise<void> {
    const permissionsToBeRemoved: PermissionModel[] =
      await this.permissionService.find({ businessId, role: RolesEnum.merchant });

    const users: User[] = await this.userModel.find(
      {
        _id: { $in: permissionsToBeRemoved.map((permission: any) => permission.userId) },
      },
    );

    for (const user of users) {
      user.roles = user.roles.map((role: any) => {
        if (!role.permissions) {
          return role;
        }

        return {
          name: role.name,
          permissions: role.permissions.filter(
            (permission: any) =>
              !permissionsToBeRemoved.map((item: any) => item._id).includes(permission),
          ),
        };
      });

      await user.save();
    }

    await this.permissionService.removeByBusinessId(businessId, RolesEnum.merchant);
  }

  public async approveRegistration(businessId: string, dto: ApproveRegistrationDto): Promise<void> {
    const userPerms: PermissionModel[] =
      await this.permissionService.find({ businessId });

    const user: User = await this.userModel.findOne(
      {
        _id: { $in: userPerms.map((permission: any) => permission.userId) },
        email: dto.email,
      },
    ).exec();

    if (!user) {
      throw new NotFoundException();
    }

    return user.update({ isApproved: true }).exec();
  }

  public async getApproveQueueByBusiness(businessId: string): Promise<User[]> {
    const userPerms: PermissionModel[] =
      await this.permissionService.find({ businessId });

    return this.userModel.find({
      $and: [
        {
          _id: { $in: userPerms.map((permission: any) => permission.userId) },
        },
        {
          $or: [
            { isApproved: null },
            { isApproved: false },
          ],
        },
      ],
    }).exec();
  }

  public async getBusinessPermission(userId: string, businessId: string, role: string = RolesEnum.merchant)
    : Promise<PermissionModel> {
    return this.permissionService.findOrCreate(businessId, userId, role);
  }
 
  public async getInactiveUsersWithoutReminder(inactiveBefore: Date, limit: number = 100): Promise<User[]> {
    return this.userModel.find({ updatedAt: { $lt: inactiveBefore }, $or:[{ revokeAccountDateAt: {  $exists: false}}, {revokeAccountDateAt: null}] }).limit(limit);
  }

  public async revokeInactiveUsers(): Promise<number> {
    const {nModified} = await this.userModel.updateMany({ revokeAccountDateAt: { $lt: new Date() } }, { isRevoked: true }).exec();

    return nModified;
  }

  public async setRevokeAccountDate(userId: string, revokeAccountDateAt: Date): Promise<void> {
    await this.userModel.updateOne(
      { _id: userId },
      { $set: { revokeAccountDateAt } },
    ).exec();
  }

  private async updateAclsByBusiness(
    userId: string,
    install: boolean,
    businessId: string,
    appCode: string[],
    isAdmin: boolean = false,
  ): Promise<PermissionModel> {
    const permissionModel: PermissionModel =
      await this.getBusinessPermission(userId, businessId, RolesEnum.merchant);

    appCode.forEach((microservice: string) => {
      UserService.updateAclByBusiness(permissionModel, microservice, install, isAdmin);
    });

    return this.permissionService.findOneAndUpdate(
      permissionModel._id,
      { acls: permissionModel.acls } as any,
    );
  }

  // tslint:disable-next-line:cognitive-complexity
  private static updateAclByBusiness(
    permission: PermissionModel,
    microservice: string,
    install: boolean,
    isAdmin: boolean = false,
  ): void {

    const aclToAdd: Acl = {
      create: install,
      delete: install,
      microservice,
      read: install,
      update: install,
    };

    const aclIndex: number =
      permission.acls.findIndex((_acl: Acl) => _acl.microservice === aclToAdd.microservice);
    const currentAcl: Acl = aclIndex > -1 ? permission.acls[aclIndex] : null;
    const adminAcl: Acl =
      permission.acls.find((_acl: Acl) => _acl.microservice === defaultCommercesOsGroup.microservice);
    isAdmin = isAdmin || (!!adminAcl && adminAcl.create && adminAcl.delete && adminAcl.read && adminAcl.update);
    if (!!currentAcl) {
      let newAcl: Acl;
      if (install) {
        newAcl = isAdmin ? aclToAdd : !!currentAcl.original ? { ...currentAcl.original } : currentAcl;
      } else {
        newAcl = {
          ...aclToAdd,
          original: { ...currentAcl },
        };
      }
      permission.acls.splice(
        aclIndex,
        1,
        newAcl,
      );
    } else {
      if (isAdmin) {
        permission.acls.push(
          aclToAdd,
        );
      }
    }
  }

  private async sameBusinessOwner(existingBusinessOwner: User, userId: string, businessId: string)
    : Promise<boolean> {
    if (existingBusinessOwner._id !== userId) {
      return false;
    }

    const permission: PermissionInterface = await this.getBusinessPermission(
      existingBusinessOwner._id,
      businessId,
      RolesEnum.merchant,
    );
    if (!permission) {
      return false;
    }

    return permission.acls.length === 0;
  }

  private static getMerchantRole(user: User): UserRoleMerchant {
    const merchantRole: UserRoleInterface | undefined = user.getRole(RolesEnum.merchant);
    if (isMerchantRoleInterface(merchantRole)) {
      return merchantRole;
    }

    const newMerchantRole: UserRoleMerchant = {
      name: RolesEnum.merchant,
      permissions: [],
    };
    user.roles.push(newMerchantRole);

    return user.getRole(RolesEnum.merchant);
  }

  public static isSecondFactorAuth(user: User): boolean {
    return !user.generalAccount && (user.secondFactorRequired || user.isAdmin());
  }
}
