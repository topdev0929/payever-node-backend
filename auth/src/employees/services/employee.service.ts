import { Injectable, NotFoundException, BadRequestException, Inject, forwardRef } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import {
  AclInterface,
  RolesEnum,
  TokensResultModel,
  UserRoleMerchant,
  PermissionInterface,
  EventDispatcher,
} from '@pe/nest-kit';
import { Model } from 'mongoose';
import { unionBy, groupBy, isMatch } from 'lodash';
import { Acl, Permission, User } from '../../users/interfaces';
import { PermissionService, UserService } from '../../users/services';
import { UpdateEmployeeDto } from '../dto';
import {
  EmployeeActivityHistory,
  EmployeeActivityHistoryInterface,
  Employee,
  Group,
  PositionInterface,
} from '../interfaces';
import { EmployeeActivityHistoryTypeEnum, Status } from '../enum';
import { EmployeeActivityHistorySchemaName, EmployeeSchemaName, GroupsSchemaName } from '../schemas';
import { EmployeeFilterInterface } from '../interfaces/employee-filter.interface';
import { EmployeeSearchInterface } from '../interfaces/employee-search.interface';
import { EmployeeOrderInterface } from '../interfaces/employee-order.interface';
import { PasswordEncoder } from '../../users/tools';
import { EmployeeConfirmation } from '../dto/employees/confirmation';
import { RequestParser, TokenService } from '../../auth/services';
import { FastifyRequestWithIpInterface, RequestFingerprint } from '../../auth/interfaces';
import { GroupsService } from './groups.service';
import { defaultAcls } from '../constants/defaults';
import { ACL_REMOVED_EVENT, ACL_UPDATED_EVENT, RabbitMessagesEnum } from '../../common';
import { EventsProducer } from '../producer/event.producer';
import { EmployeeMessageProducer } from '../producer';
import { PermissionModel } from '../../users/models';
import { InvitationService } from './invitation.service';

@Injectable()
export class EmployeeService {
  constructor(
    @InjectModel(EmployeeSchemaName) private readonly employeeModel: Model<Employee>,
    @InjectModel(EmployeeActivityHistorySchemaName)
    private readonly employeeActivityHistoryModel: Model<EmployeeActivityHistory>,
    @InjectModel(GroupsSchemaName) private readonly groupsModel: Model<Group>,
    @Inject(forwardRef(() => InvitationService)) private invitationService: InvitationService,
    private readonly permissionService: PermissionService,
    private readonly userService: UserService,
    private readonly tokenService: TokenService,
    private readonly groupsService: GroupsService,
    private readonly eventProducer: EventsProducer,
    private readonly employeeMessageProducer: EmployeeMessageProducer,
    private readonly eventDispatcher: EventDispatcher,
  ) { }

  public async findBy(conditions: any): Promise<Employee[]> {
    return this.employeeModel.find(conditions);
  }

  public async findOneBy(conditions: any): Promise<Employee> {
    return this.employeeModel.findOne(conditions);
  }

  public async listEmployees(
    businessId: string,
    filter: EmployeeFilterInterface,
    search: EmployeeSearchInterface,
    order: EmployeeOrderInterface,
    limit: number,
    page: number,
  ): Promise<{ data: Employee[]; count: number }> {
    const query: any[] = [
      // tslint:disable-next-line no-duplicate-string
      { $match: { 'positions.businessId': businessId } },
      {
        $project: {
          _id: 1,
          email: 1,
          email_i: { $toLower: '$email' },
          firstName: 1,
          fullName: { $concat: ['$firstName', ' ', '$lastName'] },
          lastName: 1,
          positions: 1,
          roles: 1,
        },
      },
      { $unwind: '$positions' },
      { $addFields: { status: { $toString: '$positions.status' } } },
      {
        $addFields: {
          nameAndEmail: {
            $cond: {
              else: '$email',
              if: {
                $eq: ['$status', Status.active],
              },
              then: { $concat: ['$firstName', ' ', '$lastName'] },
            },
          },
        },
      },
      { $match: { 'positions.businessId': businessId } },
    ];
    const match: any = { $match: { } };
    if (search) {
      match.$match.$or = [
        { email: search },
        { fullName: search },
        { firstName: search },
        { lastName: search },
        { nameAndEmail: search },
      ];
    }
    if (filter) {
      match.$match = { ...match.$match, ...filter };
    }
    query.push(match);
    const countQuery: any = [...query];
    countQuery.push({ $count: 'count' });
    query.push({ $sort: order });
    query.push({ $skip: limit * (page - 1) });
    query.push({ $limit: limit });
    const [count = { count: 0 }]: any = await Promise.resolve(this.employeeModel.aggregate(countQuery));

    return Promise.resolve({ data: await Promise.resolve(this.employeeModel.aggregate(query)), count: count.count });
  }

  public async getBusinessAcls(businessId: string, userId: string): Promise<Acl[]> {
    const permission: PermissionModel = await this.permissionService.findOneBy({
      businessId,
      userId,
    });

    return permission ? permission.acls : [];
  }

  public async employeePosition(email: string, businessId: string): Promise<PositionInterface | null> {
    const employee: Employee = await this.employeeModel.findOne({ email });

    if (!employee) {
      return null;
    }

    return employee.positions?.find(
      (position: PositionInterface) => position.businessId === businessId,
    );
  }

  public async deleteEmployee(employee: Employee): Promise<void> {
    if (!employee) {
      return;
    }

    await this.groupsModel.updateMany({ employees: employee.id }, { $pull: { employees: employee.id } as never });
    await this.employeeModel.findByIdAndDelete(employee.id);
  }

  public async recordEmployeeActivityHistory(
    employeeActivityHistory: EmployeeActivityHistoryInterface,
  ): Promise<void> {
    await this.employeeActivityHistoryModel.create(employeeActivityHistory);
  }

  public async temporaryRemoveEmployeeFromBusiness(employee: Employee, businessId: string): Promise<Employee> {
    const user: User = await this.userService.findOneByEmail(employee.email);
    if (user) {
      const merchantRole: UserRoleMerchant = user.getRole(RolesEnum.merchant);

      if (merchantRole?.permissions) {
        for (const permissionId of Object.keys(merchantRole.permissions).reverse()) {
          const permission: Permission = merchantRole.permissions[permissionId];
          if (permission.businessId === businessId) {
            merchantRole.permissions.splice(parseInt(permissionId, 10));
          }
        }
        await user.save();
      }

    }

    await this.userService.removePermissionsFromRole(user.id, businessId);

    if (user) {
      await this.employeeMessageProducer.produceEmployeeRemovedSynced(user.id, businessId, employee.id);
      await this.eventDispatcher.dispatch(ACL_UPDATED_EVENT, [user], businessId);
    }

    return employee;
  }

  public async removeEmployeeFromBusiness(employee: Employee, businessId: string): Promise<Employee> {
    const user: User = await this.userService.findOneByEmail(employee.email);
    if (user) {
      const merchantRole: UserRoleMerchant = user.getRole(RolesEnum.merchant);

      if (merchantRole?.permissions) {
        for (const permissionId of Object.keys(merchantRole.permissions).reverse()) {
          const permission: Permission = merchantRole.permissions[permissionId];
          if (permission.businessId === businessId) {
            merchantRole.permissions.splice(parseInt(permissionId, 10));
          }
        }
        await user.save();
      }

    }

    [employee] = await Promise.all([
      this.employeeModel.findByIdAndUpdate(
        employee.id,
        {
          $pull: {
            permissions: { businessId } as never,
            positions: { businessId } as never,
          },
        },
        { new: true },
      ),
      this.groupsModel.updateMany({ employees: employee.id }, { $pull: { employees: employee.id } as never }),
      this.userService.removePermissionsFromRole(user.id, businessId),
    ]);

    if (user) {
      await this.employeeMessageProducer.produceEmployeeRemovedSynced(user.id, businessId, employee.id);
      await this.eventDispatcher.dispatch(ACL_REMOVED_EVENT, [user], businessId);
    }

    return employee;
  }

  public async insert(employee: Employee): Promise<void> {
    try {
      const existingEmployee: Employee = await this.employeeModel.findOne({ email: employee.email }).exec();

      if (existingEmployee) {
        return;
      }

      await this.employeeModel.create(employee);
    } catch (e) { }
  }

  public async update(employee: Employee, dto: any): Promise<Employee> {
    delete dto.companyName;
    delete dto.phoneNumber;
    delete dto.address;
    delete dto.userId;

    await this.employeeModel.findOneAndUpdate(
      { _id: employee._id },
      { $set: { ...dto } },
    ).exec();

    return this.updateUserId(employee);
  }

  public async updateEmployee(employee: Employee, dto: UpdateEmployeeDto, businessId: string): Promise<Employee> {
    const updatedEmployee: Employee = await this.update(employee, dto);
    if (!businessId) {
      return;
    }

    dto.acls = EmployeeService.mergeAcls(defaultAcls, dto.acls);
    updatedEmployee.permissions = updatedEmployee.permissions ?
      updatedEmployee.permissions : [];
    const permissionIndex: number = updatedEmployee.permissions.findIndex(
      (a: PermissionInterface) => a.businessId === businessId,
    );

    let oldAcls: AclInterface[] = [];

    if (permissionIndex < 0) {
      updatedEmployee.permissions.push({
        acls: dto.acls,
        businessId,
      });
    } else {
      oldAcls = updatedEmployee.permissions[permissionIndex].acls;
      updatedEmployee.permissions[permissionIndex].acls = dto.acls;
    }

    const permissionChannged: boolean = !isMatch(oldAcls, dto.acls);

    if (permissionChannged) {
      await this.recordPermissionChange(
        dto.acls,
        oldAcls,
        businessId,
        employee._id,
      );
    }

    const businessPosition: PositionInterface = updatedEmployee.positions?.find(
      (position: PositionInterface) => position.businessId === businessId,
    );

    const employeeWithUpdatedStatus: Employee = await this.employeeModel.findOneAndUpdate(
      { _id: employee._id, 'positions.businessId': businessId },
      {
        $set: {
          permissions: updatedEmployee.permissions,
          'positions.$.positionType': dto.position,
          'positions.$.status': dto.status,
        },
      },
      {
        new: true,
      }
    ).exec();

    if (!employeeWithUpdatedStatus.userId) {
      return;
    }

    await this.updatePermissions(employeeWithUpdatedStatus, businessId);
    await this.handleStatusChange(employee, dto.status, businessPosition.status, businessId);

    return employeeWithUpdatedStatus;
  }

  public async handleStatusChange(
    employee: Employee,
    newStatus: Status,
    currentStatus: Status,
    businessId: string,
  ): Promise<void> {

    if (newStatus === currentStatus) {
      return;
    }

    if (newStatus === Status.invited) {
      await this.invitationService.invite(employee, businessId);
    }

    if (newStatus === Status.saved) {
      await this.temporaryRemoveEmployeeFromBusiness(employee, businessId);
    }

    if (newStatus === Status.active) {
      await this.employeeMessageProducer.produceEmployeeAddedSynced(employee.userId, businessId, employee.id);
    }
  }

  public async recordPermissionChange(
    newAcls: Acl[],
    olsAcls: Acl[],
    businessId: string,
    employeeId: string,
  ): Promise<void> {
    const histories: EmployeeActivityHistory[] = await this.employeeActivityHistoryModel.find({
      documentId: employeeId,
      field: EmployeeActivityHistoryTypeEnum.permission,
    });

    if (!histories?.length) {
      await this.recordEmployeeActivityHistory(
        {
          businessId,
          documentId: employeeId,
          field: EmployeeActivityHistoryTypeEnum.permission,
          value: olsAcls,
        }
      );
    }

    await this.recordEmployeeActivityHistory(
      {
        businessId,
        documentId: employeeId,
        field: EmployeeActivityHistoryTypeEnum.permission,
        value: newAcls,
      }
    );
  }

  public static checkAccess(employee: Employee, businessId: string): void | never {
    if (employee.positions && employee.positions.length) {
      for (const position of employee.positions) {
        if (businessId === position.businessId) {
          return;
        }
      }
    }

    throw new NotFoundException('No such employee found within the specified business');
  }

  public async countByEmail(email: string, businessId: string): Promise<number> {
    return this.employeeModel.countDocuments({ email, 'positions.businessId': businessId });
  }

  public async confirmEmployee(
    confirmation: EmployeeConfirmation,
    employee: Employee,
    request: FastifyRequestWithIpInterface,
  ): Promise<TokensResultModel> {
    const businessPosition: PositionInterface = employee.positions?.find(
      (position: PositionInterface) => position.businessId === confirmation.businessId,
    );

    if (businessPosition.status === Status.saved) {
      throw new BadRequestException(`Employee is inactive`);
    }

    const salt: string = PasswordEncoder.salt();
    const password: string = PasswordEncoder.encodePassword(confirmation.password, salt);

    await this.eventProducer.sendMessage(
      {
        confirmation,
        employee,
      },
      RabbitMessagesEnum.EmployeeConfirm,
    );

    const user: User = await this.userService.findOneByEmail(employee.email);

    employee = await this.employeeModel.findOneAndUpdate(
      { _id: employee.id },
      {
        $set: {
          firstName: confirmation.firstName,
          isActive: true,
          isVerified: true,
          lastName: confirmation.lastName,
          userId: user._id,
        },
      },
    ).exec();

    await this.userService.update(
      user._id,
      {
        firstName: confirmation.firstName,
        isActive: true,
        isVerified: true,
        lastName: confirmation.lastName,
        password,
        salt,
      } as User,
    );

    return this.confirmEmployeeInBusiness(confirmation.businessId, employee, request);
  }

  public async updateUserId(employee: Employee): Promise<Employee> {
    const user: User = await this.userService.findOneByEmail(employee.email);

    if (!user) {

      return employee;
    }

    await this.employeeModel.updateOne(
      { _id: employee.id },
      {
        $set: {
          userId: user._id,
        },
      },
    ).exec();

    return this.employeeModel.findOne({ _id: employee.id });
  }

  public async confirmEmployeeInBusiness(
    businessId: string,
    employee: Employee,
    request: FastifyRequestWithIpInterface,
  ): Promise<TokensResultModel> {

    await this.eventProducer.sendMessage(
      {
        businessId,
        employee,
      },
      RabbitMessagesEnum.EmployeeConfirmInBusiness,
    );

    await this.employeeModel.findOneAndUpdate(
      { _id: employee.id, 'positions.businessId': businessId },
      {
        $set: {
          'positions.$.status': Status.active,
        },
      },
    ).exec();

    employee = await this.employeeModel.findOne(
      { _id: employee.id },
    );

    const parsedRequest: RequestFingerprint = RequestParser.parse(request);
    await this.updatePermissions(employee, businessId);

    return this.tokenService.issueToken(
      await this.userService.findOneByEmail(employee.email),
      parsedRequest,
      businessId,
    );
  }

  public static mergeAcls(first: AclInterface[], second: AclInterface[]): AclInterface[] {

    if (first.length <= 1) {
      return unionBy(first, second, 'microservice');
    }

    const group: any = groupBy([...first, ...second], 'microservice');

    const res: AclInterface[] = Object.keys(group).map(k => {

      return {
        create: group[k][0].create || group[k][1].create,
        delete: group[k][0].delete || group[k][1].delete,
        microservice: group[k][0].microservice,
        read: group[k][0].read || group[k][1].read,
        update: group[k][0].update || group[k][1].update,
      };
    });

    return res;
  }

  public static getRemovedAcls(originalGroup: Group, newGroup: Group): AclInterface[] {
    const plainOriginal: Group = originalGroup.toObject();
    const plainNewGroup: Group = newGroup.toObject();
    const aclsToRemove: AclInterface[] = [];
    plainOriginal.acls.forEach((originalAcl: AclInterface) => {
      const updatedAcl: AclInterface = plainNewGroup.acls.find(
        (_updatedAcl: AclInterface) => _updatedAcl.microservice === originalAcl.microservice,
      );
      if (updatedAcl) {
        const aclToRemove: AclInterface = {
          microservice: updatedAcl.microservice,
        };
        aclsToRemove.push(aclToRemove);
        for (const permission in originalAcl) {
          if (permission !== 'microservice' && originalAcl[permission] && !updatedAcl[permission]) {
            aclToRemove[permission] = false;
            const existedAcl: AclInterface = aclsToRemove.find(
              (_acl: AclInterface) => _acl.microservice === aclToRemove.microservice,
            );
            existedAcl[permission] = false;
          }
        }
      }
    });

    return aclsToRemove;
  }

  public async removeEmployeeFromGroup(
    employeeId: string,
    businessId: string,
    groupAcl: AclInterface[],
  ): Promise<User> {
    const groups: Group[] = await this.groupsService.getGroupsByEmployeeId(employeeId);
    let innerGroupAcl: AclInterface[] = [...groupAcl];
    innerGroupAcl = GroupsService.getEnabledAcls(innerGroupAcl);
    const newAcls: AclInterface[] = GroupsService.disableAclDuplicate(innerGroupAcl, groups);
    innerGroupAcl = innerGroupAcl.map((acl: any) => {
      const newAcl: AclInterface = { microservice: acl.microservice };
      if (acl && acl.toObject) {
        acl = acl.toObject();
      }
      for (const permission in acl) {
        if (permission !== 'microservice') {
          newAcl[permission] = false;
        }
      }

      return newAcl;
    });
    const aclsToSet: AclInterface[] = EmployeeService.mergeAcls(newAcls, innerGroupAcl);
    const employee: Employee = await this.findOneBy({ _id: employeeId });

    return this.userService.removePermissions(employee.userId, businessId, aclsToSet);
  }

  public static getAddedAcls(originalGroup: Group, newGroup: Group): AclInterface[] {
    const plainPreviousGroup: Group = originalGroup.toObject();
    const plainNextGroup: Group = newGroup.toObject();
    const aclsToAdd: AclInterface[] = [];
    plainNextGroup.acls.forEach((nextAcl: AclInterface) => {
      const updatedAcl: AclInterface = plainPreviousGroup.acls.find(
        (_updatedAcl: AclInterface) => _updatedAcl.microservice === nextAcl.microservice,
      );
      if (!updatedAcl) {
        aclsToAdd.push(nextAcl);

        return;
      }
      for (const permission in nextAcl) {
        if (permission !== 'microservice' && nextAcl[permission] && !updatedAcl[permission]) {
          const aclToRemove: AclInterface = {
            microservice: updatedAcl.microservice,
          };
          aclToRemove[permission] = true;
          const existedAcl: AclInterface = aclsToAdd.find(
            (_acl: AclInterface) => _acl.microservice === aclToRemove.microservice,
          );
          if (!existedAcl) {
            aclsToAdd.push(aclToRemove);
          } else {
            existedAcl[permission] = true;
          }
        }
      }
    });

    return aclsToAdd;
  }

  public static ensurePermissions(permissions: AclInterface[]): AclInterface[] {
    // tslint:disable-next-line
    for (let i: number = 0; i < defaultAcls.length; i++) {
      const index: number =
        permissions.findIndex((item: AclInterface) => item.microservice === defaultAcls[i].microservice);

      if (index === -1) {
        permissions.push(defaultAcls[i]);
      } else {
        permissions[index] = {
          ...permissions[index],
          ...defaultAcls[i],
        };
      }
    }

    return permissions;
  }

  public async updatePermissions(employee: Employee, businessId: string, replace: boolean = false): Promise<void> {

    const isActive: boolean = employee.positions.some(
      (a: PositionInterface) => a.businessId === businessId && a.status === Status.active,
    );

    if (!isActive) {
      return;
    }

    const user: User = await this.userService.findOneByEmail(employee.email);
    if (!user) {
      return;
    }

    const permission: PermissionInterface = employee.permissions.find(
      (a: PermissionInterface) => a.businessId === businessId,
    );

    const groups: Array<{ acls: AclInterface[]; businessId: string }> = await this.groupsService.getGroups(
      employee._id,
      businessId,
      ['acls', 'businessId'],
    );

    let newAcl: AclInterface[] = [];
    if (!groups || groups.length <= 0) {
      newAcl = permission ? permission.acls : [];
      newAcl = newAcl.map(ac => ({
        create: false,
        delete: false,
        microservice: ac.microservice,
        read: false,
        update: false,
      }));
      newAcl = [...newAcl, ...defaultAcls];
    }

    if (groups && groups.length) {
      for (const group of groups) {
        if (newAcl.length <= 0) {
          newAcl.push(...group.acls);
        } else {
          newAcl = EmployeeService.mergeAcls(group.acls, newAcl);
        }
      }
      newAcl = [...newAcl, ...defaultAcls];
    }

    if (permission && permission.acls) {
      newAcl = EmployeeService.mergeAcls(permission.acls, newAcl);
    }

    await this.userService.assignPermissions(user._id, businessId, newAcl);
    await this.eventDispatcher.dispatch(ACL_UPDATED_EVENT, [user], businessId);
  }
}
