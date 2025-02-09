import { BadRequestException, Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import {
  AclInterface,
  RolesEnum,
  TokensResultModel,
  UserTokenInterface,
} from '@pe/nest-kit';
import { validate, ValidationError } from 'class-validator';
import { Model } from 'mongoose';
import { v4 as uuid } from 'uuid';

import { FastifyRequestWithIpInterface, RequestFingerprint } from '../../auth/interfaces';
import { RequestParser, TokenService } from '../../auth/services';
import { environment } from '../../environments';
import { PermissionService, TrustedDomainService, UserService } from '../../users/services';
import { CreateEmployeeDto } from '../dto';
import { Positions, Status } from '../enum';
import { Employee, Group, PositionInterface } from '../interfaces';
import { EmployeeMessageProducer, EventsProducer, InivtationEventsProducer } from '../producer';
import { EmployeeService } from './employee.service';
import { GroupsService } from './groups.service';
import { Acl, User } from '../../users/interfaces';
import { RabbitMessagesEnum } from '../../common';
import { EmployeeSettingsService } from './employee-settings.service';
import {
  OWN_EMAIL_ERROR_MESSAGE,
  BLOCKED_EMAIL_ERROR_MESSAGE,
  defaultAcls,
} from '../constants';
import { BlockEmailService } from '../../blocked-email/services/block-email.service';
import { BusinessLocalDocument } from '../../business/schemas';
import { BusinessService } from '@pe/business-kit';

@Injectable()
export class InvitationService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly tokenService: TokenService,
    private readonly userService: UserService,
    private readonly permissionService: PermissionService,
    @InjectModel('Employee') private readonly employeeModel: Model<Employee>,
    private readonly groupsService: GroupsService,
    private readonly invitationEventsProducer: InivtationEventsProducer,
    private readonly eventProducer: EventsProducer,
    private readonly employeeSettingsService: EmployeeSettingsService,
    private readonly blockEmailService: BlockEmailService,
    private readonly trustedDomainService: TrustedDomainService,
    private readonly businessService: BusinessService<BusinessLocalDocument>,
    private readonly employeeService: EmployeeService,
    private readonly employeeMessageProducer: EmployeeMessageProducer,
  ) { }

  public async create(
    user: UserTokenInterface,
    createId: string,
    dto: CreateEmployeeDto,
    businessId: string,
    shouldInvite: boolean,
  ): Promise<Employee> {
    const dbUser: User = await this.userService.findOneByEmail(user.email);
    if (!await this.hasBusiness(dbUser, businessId)) {
      throw new NotFoundException();
    }

    if (user.email === dto.email) {
      throw new BadRequestException(OWN_EMAIL_ERROR_MESSAGE);
    }

    return this.createOrUpdate(createId, dto, businessId, shouldInvite);
  }

  public async createAndInviteEmployeeForBusiness(
    email: string,
    firstName: string,
    lastName: string,
    language: string,
    businessId: string,
  ): Promise<{ isDomainTrusted: boolean; isVerified: boolean; needApproval: boolean }> {
    const business: BusinessLocalDocument = await this.businessService.findOneById(businessId);

    if (!business) {
      throw new NotFoundException('Business not found!');
    }

    const dbUser: User = await this.userService.findOneByEmail(email);

    let employee: Employee = await this.employeeModel.findOne({ email }).exec();
    const isDomainTrusted: boolean = await this.trustedDomainService.isDomainTrusted(
      email.split('@').pop(),
      businessId,
    );

    if (employee) {
      const businesssPosition: PositionInterface = employee.positions?.find(
        (position: PositionInterface) => position.businessId === businessId,
      );

      if (businesssPosition?.status === Status.active) {

        return { isDomainTrusted, isVerified: employee.isVerified, needApproval: false };
      }
      if (businesssPosition) {

        if (isDomainTrusted && businesssPosition.status !== Status.needApproval) {
          await this.invite(employee, businessId, true);
        }

        return {
          isDomainTrusted,
          isVerified: employee.isVerified,
          needApproval: businesssPosition.status === Status.needApproval,
        };
      }
    }

    const group: Group = await this.groupsService.findOrCreateDefaultTrustedDomainGroup(businessId);

    const dto: CreateEmployeeDto = {
      email: email,
      firstName: firstName,
      fullValidation: true,
      groups: [group._id],
      language: language,
      lastName: lastName,
      position: Positions.staff,
      status: Status.saved,
      userId: dbUser._id,
    } as CreateEmployeeDto;

    employee = await this.createOrUpdate(
      uuid(),
      dto,
      businessId,
      false,
      !isDomainTrusted,
    );

    await this.eventProducer.sendMessage(
      {
        businessId,
        employee,
        groups: [group._id],
      },
      RabbitMessagesEnum.EmployeeRegister,
    );

    if (isDomainTrusted) {
      await this.invite(employee, businessId, true);
    } else {
      const businesssPosition: PositionInterface = employee.positions?.find(
        (position: PositionInterface) => position.businessId === businessId,
      );

      if (businesssPosition && businesssPosition?.status === Status.needApproval) {
        const businessOwner: User = await this.userService.findOneBy({ _id: business.owner });
        await this.employeeMessageProducer.produceUntrustedDomainRegisteredEmailMessage(
          businessId,
          businessOwner.email,
          {
            email: employee.email,
            firstName: employee.firstName,
            fullName: employee.fullName,
            lastName: employee.lastName,
            position: businesssPosition.positionType,
          },
          businessOwner.language,
        );
      }
    }

    const newBusinesssPosition: PositionInterface = employee.positions?.find(
      (position: PositionInterface) => position.businessId === businessId,
    );

    return {
      isDomainTrusted,
      isVerified: employee.isVerified,
      needApproval: newBusinesssPosition?.status === Status.needApproval,
    };
  }

  public async approveEmployee(
    user: UserTokenInterface,
    employee: Employee,
    business: BusinessLocalDocument,
  ): Promise<void> {
    const dbUser: User = await this.userService.findOneByEmail(user.email);

    if (employee.isVerified === true) {
      throw new BadRequestException('Employee has already been approved');
    }

    if (!await this.hasAdminPermission(dbUser, business)) {
      throw new ForbiddenException('Only admin can perform this action');
    }

    await this.updatePermissionOnVerification(employee.email, business._id);
    await this.employeeMessageProducer.produceEmployeeAccessApprovedEmailMessage(
      business._id,
      employee.email,
      {
        firstName: employee.firstName,
      },
      employee.language,
    );
  }

  public async rejectEmployee(
    user: UserTokenInterface,
    employee: Employee,
    business: BusinessLocalDocument,
  ): Promise<void> {
    const dbUser: User = await this.userService.findOneByEmail(user.email);
    if (!await this.hasAdminPermission(dbUser, business)) {
      throw new ForbiddenException('Only admin can perform this action');
    }

    await this.employeeService.removeEmployeeFromBusiness(employee, business._id);
  }

  public async createOrUpdate(
    createId: string,
    dto: CreateEmployeeDto,
    businessId: string,
    shouldInvite: boolean,
    needApproval: boolean = false,
  ): Promise<Employee> {
    let employee: Employee = await this.employeeModel.findOne({ email: dto.email }).exec();
    const groups: string[] = dto.groups;
    delete dto.groups;
    let acls: AclInterface[] = dto.acls ? dto.acls : [];

    if (await this.blockEmailService.checkBlocked(dto.email)) {
      throw new BadRequestException(BLOCKED_EMAIL_ERROR_MESSAGE);
    }

    if (employee) {
      if (!dto?.acls?.filter(acl => acl.microservice === 'settings')?.length) {
        dto.acls.push({
          create: true,
          delete: true,
          microservice: 'settings',
          read: true,
          update: true,
        });
      }
      if (!dto?.acls?.filter(acl => acl.microservice === 'transactions')?.length) {
        dto.acls.push({
          create: true,
          delete: true,
          microservice: 'transactions',
          read: true,
          update: true,
        });
      }
      employee = await this.employeeModel.findOneAndUpdate(
        { email: dto.email },
        {
          $addToSet: {
            permissions: {
              acls: dto.acls,
              businessId,
            },
            positions: {
              businessId,
              positionType: dto.position,
              status: needApproval ? Status.needApproval : Status.saved,
            } as never,
          },
          $set: {
            firstName: dto.firstName,
            lastName: dto.lastName,
          },
        },
        { new: true },
      ).exec();
    } else {
      dto.fullValidation = true;
      const errors: ValidationError[] = await validate(dto);

      if (errors && errors.length) {
        throw new BadRequestException(errors);
      }

      employee = await this.employeeModel.create({
        _id: createId,
        isVerified: false,
        ...dto,
        permissions: [{
          acls,
          businessId,
        }],
        positions: [
          {
            businessId,
            positionType: dto.position,
            status: needApproval ? Status.needApproval : Status.saved,
          },
        ],
        roles: [],
      } as any);
    }
    acls = EmployeeService.mergeAcls(defaultAcls, acls);

    acls = EmployeeService.ensurePermissions(acls);

    await this.addGroupAcls(employee, groups, acls);

    if (shouldInvite) {
      return this.invite(employee, businessId);
    }

    return employee;
  }

  public async addGroupAcls(employee: Employee, groups: string[], acls: Acl[]): Promise<Acl[]> {
    if (groups && groups.length) {
      await this.groupsService.addToGroups(employee._id, groups);

      for (const groupId of groups) {
        const group: Group = await this.groupsService.getGroupById(groupId);
        acls = EmployeeService.mergeAcls(group.acls, acls);
      }
    }

    return acls;
  }

  public async inviteByBusinessOwner(
    user: UserTokenInterface,
    status: Status[],
    dryRun: boolean = false,
  ): Promise<any> {
    const inviteResult: any[] = [];

    const businesses: BusinessLocalDocument[] = await this.businessService.findAll({ owner: user.id });

    for (const business of businesses) {
      const expiryHours: number = await this.employeeSettingsService.getExpiryHoursByBusinessId(business._id);

      const employees: Employee[] = await this.employeeModel.find(
        { positions: { $elemMatch: { businessId: business._id, status: { $in: status } } } },
      );
      for (const employee of employees) {
        if (!dryRun) {
          await this.invite(employee, business._id);
        }

        const businessPosition: PositionInterface = employee.positions.find(
          (position: PositionInterface) => position.businessId === business._id,
        );

        inviteResult.push(
          {
            businessId: business._id,
            businessName: business.name,
            employeeEmail: employee.email,
            expiryHours: expiryHours,
            position: businessPosition,
          },
        );
      }
    }

    return inviteResult;
  }

  public async inviteAllEmployee(): Promise<void> {
    const employees: Employee[] = await this.employeeModel.find({
      positions: { $elemMatch: { status: Status.invited } },
    });

    for (const employee of employees) {
      for (const position of employee.positions) {
        if (position.status === Status.invited) {
          await this.invite(employee, position.businessId);
        }
      }
    }
  }

  public async resendInvite(
    user: UserTokenInterface,
    dto: Employee,
    businessId: string,
  ): Promise<void> {
    const dbUser: User = await this.userService.findOneByEmail(user.email);
    if (!await this.hasBusiness(dbUser, businessId)) {
      throw new NotFoundException();
    }

    if (user.email === dto.email) {
      throw new BadRequestException(OWN_EMAIL_ERROR_MESSAGE);
    }

    const employee: Employee = await this.employeeModel.findOne({ email: dto.email });

    const businessPosition: PositionInterface = employee.positions?.find(
      (position: PositionInterface) => position.businessId === businessId,
    );

    if (businessPosition && businessPosition.status !== Status.active) {
      await this.invite(employee, businessId);
    }
  }

  public async invite(
    employee: Employee,
    businessId: string,
    employeeRegistration: boolean = false,
  ): Promise<Employee> {
    const expiryHours: number = await this.employeeSettingsService.getExpiryHoursByBusinessId(businessId);

    const emailToken: string = this.jwtService.sign(
      { id: employee.id, businessId, email: employee.email },
      { expiresIn: `${expiryHours}h` },
    );

    const encodedEmail: string = this.encodeEmailSpecialCharacters(employee.email);

    const payload: string =
      `?token=${emailToken}&email=${encodedEmail}&firstName=${employee.firstName}&lastName=${employee.lastName}`;
    const link: string = `${environment.commerseOSUrl}/verification${payload}`;

    if (employeeRegistration) {
      await this.employeeMessageProducer.produceEmployeeRegisteredEmailMessage(
        businessId,
        employee.email,
        link,
        employee.language,
      );
    } else {
      await this.invitationEventsProducer
        .produceStaffInvitationEmailMessage(businessId, employee.email, link, employee.language);
    }

    const updatedEmployee: Employee = await this.employeeModel.findOneAndUpdate(
      { email: employee.email, 'positions.businessId': businessId },
      {
        $addToSet: {
          roles: { $each: employee.roles } as never,
        },
        $set: {
          'positions.$.status': Status.invited,
        },
      },
      { new: true },
    );

    await this.eventProducer.sendMessage(
      {
        businessId,
        employee: updatedEmployee,
      },
      RabbitMessagesEnum.EmployeeInvite,
    );

    return updatedEmployee;
  }

  public async verify(
    token: string,
    request: FastifyRequestWithIpInterface,
  ): Promise<TokensResultModel & { isValid?: boolean }> {
    const parsedRequest: RequestFingerprint = RequestParser.parse(request);
    let tokenResult: { email: string; businessId: string };

    try {
      tokenResult = this.jwtService.verify(token);
    } catch (e) {
      throw new BadRequestException('Token is not valid');
    }

    const { email, businessId }: { email: string; businessId: string } =  tokenResult;

    if (!(email && businessId)) {
      throw new BadRequestException('Token is not valid');
    }

    const user: User = await this.userService.findOneByEmail(email);

    if (!user) {
      return {
        accessToken: '',
        isValid: true,
      };
    }

    return this.tokenService.issueToken(user, parsedRequest, businessId);
  }

  public async updatePermissionOnVerification(email: string, businessId: string): Promise<void> {
    const employee: Employee = await this.employeeModel.findOneAndUpdate(
      { email, 'positions.businessId': businessId },
      {
        $set: {
          isVerified: true,
          'positions.$.status': Status.active,
        },
      },
      { new: true },
    ).exec();

    await this.eventProducer.sendMessage(
      {
        businessId,
        employee,
      },
      RabbitMessagesEnum.EmployeeVerify,
    );

    await this.employeeService.updatePermissions(employee, businessId);
  }

  public static mergeGroupPermissions(
    businessId: string,
    groups: Array<{ acls: AclInterface[]; businessId: string }>,
  ): AclInterface[] {
    const acls: AclInterface[] = defaultAcls;

    const existingGroups: string[] = [];

    for (const group of groups) {
      if (group.businessId === businessId) {
        this.addPermission(acls, group, existingGroups);
      }
    }

    return acls;
  }

  public async hasAdminPermission(user: User, business: BusinessLocalDocument): Promise<boolean> {
    if (business.owner === user._id) {
      return true;
    }

    const employee: Employee = await this.employeeModel.findOne({ email: user.email });

    if (!employee) {
      return false;
    }

    const businessPermission: PositionInterface = employee.positions.find((position: PositionInterface) => {
      return position.businessId === business._id && position.status === Status.active;
    });

    return businessPermission.positionType === Positions.admin;
  }

  private async hasBusiness(user: User, businessId: string): Promise<boolean> {
    return !!(await this.permissionService.findOneBy(
      {
        businessId,
        role: RolesEnum.merchant,
        userId: user._id,
      },
    ));
  }

  private static addPermission(
    acls: AclInterface[],
    group: { acls: AclInterface[]; businessId: string },
    existingGroups: string[],
  ): void {
    for (const acl of group.acls) {
      if (existingGroups.includes(acl.microservice)) {
        for (const aclId of Object.keys(acls)) {
          if (acls[aclId] && acls[aclId].microservice === acl.microservice) {
            acls.splice(parseInt(aclId, 10), 1);
          }
        }
      }
      acls.push(acl);
      existingGroups.push(acl.microservice);
    }
  }

  public encodeEmailSpecialCharacters(email: string): string {
    const parts: string[] = email.split('@');
    const username: string = parts[0];
    const domain: string = parts[1];

    const encodedUsername: string = username.replace(/[^a-zA-Z0-9]/g, (match) => {
      return encodeURIComponent(match);
    });

    return encodedUsername + '@' + domain;
  }
}
