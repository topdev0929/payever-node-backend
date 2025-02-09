// tslint:disable:no-duplicate-string
import { BaseFixture } from '@pe/cucumber-sdk/module';
import { RolesEnum, UserRoleInterface, UserRoleMerchant } from '@pe/nest-kit';
import { Model } from 'mongoose';
import { Status } from '../../src/employees/enum';
import { Employee } from '../../src/employees/interfaces';
import { SocialModel } from '../../src/social/models';
import { Group } from '../../src/employees/interfaces';
import { LocationInterface } from '../../src/auth/interfaces';
import { Permission, User } from '../../src/users/interfaces';
import { PasswordEncoder } from '../../src/users/tools';
import { BUSINESS_2_ID, MERCHANT_USER_ID } from './const';

const defaultPassword: string = '12345678';
const salt: string = 'uxG7ynPrh0YoyOPQTNo6VwYv9tqiQ7DFtaflNBm/PZA';

class UsersFixture extends BaseFixture {
  public static adminUuid: string = '15edf7ca-cc8e-406c-9cd5-964b19eafb11';
  public static merchantUuid: string = MERCHANT_USER_ID;
  public static secondFactorUserUuid: string = 'ac031fc5-43d8-4e17-a07b-daa1c3b8ea81';
  public static employeeWithoutPassword: string = 'ac031fc5-43d8-4e17-a07b-daa1c3b8ea85';

  private readonly userModel: Model<User> = this.application.get('UserModel');
  private readonly employeeModel: Model<Employee> = this.application.get('EmployeeModel');
  private readonly permissionModel: Model<Permission> = this.application.get('PermissionModel');
  private readonly locationModel: Model<LocationInterface> = this.application.get('LocationModel');
  private readonly socialModel: Model<SocialModel> = this.application.get('SocialModel');
  private readonly groupModel: Model<Group> = this.application.get('GroupsModel');

  private readonly employeeId: string = '09d1fdca-f692-4609-bc2d-b3003a24c30a';
  private readonly employeeId2: string = '09d1fdca-f692-4609-bc2d-b3003a24c30b';
  private readonly employeeId3: string = '303db8fd-b160-4cdd-949f-fa566c0a8aed';
  private readonly employeeId4: string = '787e4b36-ecfa-4e86-a915-d06fb21f4ed3';
  private readonly employeeId5: string = '787e4b36-ecfa-4e86-a915-d06fb21t4ed3';
  private readonly employeeId6: string = '09d1fdca-f692-4609-bc2d-b3103a24c30a';

  private readonly userId1: string = 'cc3bec59-6f88-4d48-91af-0f391bbb8ce2';
  private readonly userId2: string = '8b5fb669-8fa0-8c83-a8dd-8fa8d45d2098';
  private readonly userId3: string = '8b5fb669-8fa0-8c83-a8dd-8fa8d45d2091';
  private readonly userId4: string = '9d02442c-f504-4e1f-aea1-179084510248';
  private readonly userId5: string = '25ce50e7-1a76-47eb-a97f-9f2807a67979';

  private readonly businessId1: string = '74b58859-3a62-4b63-83d6-cc492b2c8e29'
  private readonly groupId: string = '74b58859-3a62-4b63-83d6-cc492b2c8e50';


  public async apply(): Promise<void> {
    await this.createAdmin();
    await this.createMerchant();
    await this.create2Fa();
    await this.createEmployee();
    await this.createEmployeeNotRegistered();
    await this.createEmployeeWithoutPassword();
    await this.createEmployeeWithActiveAndInvitedStatuses();
    await this.createEmployeeActivated();
    await this.createGroup();
    await this.createLocations();
    await this.createUserForAdminApi();
    await this.createSocialAccounts();
  }

  private async createLocations(): Promise<void> {
    await this.locationModel.create({
      _id: '9b5fb669-5fa0-4c83-a5dd-4fa8d45d2098',
      hashedSubnet: 'ca55c065e1326392ec55d0af650f7c5b',
      name: 'name',
      subnet: '6924e73d1142f5cee81b74b18cc2651b',
      userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_1) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/12.0.1 Safari/605.1.15',
      userId: 'b5965f9d-5971-4b02-90eb-537a0a6e07c7',
    });
  }

  private async createGroup(): Promise<void> {

    const defAcl: Permission[] = UsersFixture.groupAcl(this.businessId1);

    await this.userModel.create({
      _id: this.employeeId6,
      email: 'rob@intveld2.com',
      firstName: 'Rob',
      isActive: false,
      isVerified: false,
      lastName: 'Intveld',
      logo: '78ca2e67-4660-408b-9bf7-0687e9940208',
      permissions: defAcl,
      secondFactorRequired: false,
      unverifiedPeriodExpires: new Date(),
    } as any);

    await this.employeeModel.create({
      _id: this.employeeId6,
      email: 'rob@intveld2.com',
      firstName: 'Rob',
      isActive: false,
      isVerified: false,
      lastName: 'Intveld',
      logo: '78ca2e67-4660-408b-9bf7-0687e9940208',
      permissions: defAcl,
      positions: [
        {
          businessId: '74b58859-3a62-4b63-83d6-cc492b2c8e29',
          positionType: 'Cashier',
          status: Status.active,
        },
      ],
      secondFactorRequired: false,
      unverifiedPeriodExpires: new Date(),
      userId: this.employeeId6,
    } as any);

    await this.groupModel.create({
      "_id": this.groupId,
      "employees": [
        this.employeeId6
      ],
      "businessId": this.businessId1,
      "name": "Message Group",
      "acls": [
        ...defAcl[0].acls
      ],
      "__v": 0
    });
  }

  private async createSocialAccounts(): Promise<void> {
    await this.socialModel.create({
      _id: '9b5fb669-5fa0-4c83-a5dd-4fa8d45d2098',
      email: 'rob@intveld.com',
      name: 'name',
      socialId: '9b5fb669-5fa0-4c83-a5dd-4fa8d45d2098',
      type: 'facebook',
      userId: 'b5965f9d-5971-4b02-90eb-537a0a6e07c7',
    });
  }

  private async createEmployee(): Promise<void> {
    await this.userModel.create({
      _id: this.employeeId,
      email: 'rob@intveld.com',
      firstName: 'Rob',
      isActive: false,
      isVerified: false,
      lastName: 'Intveld',
      logo: '78ca2e67-4660-408b-9bf7-0687e9940208',
      permissions: UsersFixture.createEmployeeRole(),
      secondFactorRequired: false,
      unverifiedPeriodExpires: new Date(),
    } as any);

    await this.employeeModel.create({
      _id: this.employeeId,
      email: 'rob@intveld.com',
      firstName: 'Rob',
      isActive: false,
      isVerified: false,
      lastName: 'Intveld',
      logo: '78ca2e67-4660-408b-9bf7-0687e9940208',
      permissions: UsersFixture.createEmployeeRole(),
      positions: [
        {
          businessId: '74b58859-3a62-4b63-83d6-cc492b2c8e29',
          positionType: 'Cashier',
          status: Status.active,
        },
      ],
      secondFactorRequired: false,
      unverifiedPeriodExpires: new Date(),
      userId: this.employeeId,
    } as any);

    await this.employeeModel.create({
      _id: this.employeeId5,
      email: 'robb2@intveld.com',
      firstName: 'Rob',
      isActive: false,
      isVerified: false,
      lastName: 'Intveld',
      logo: '78ca2e67-4660-408b-9bf7-0687e9940208',
      permissions: UsersFixture.createEmployeeRole(),
      positions: [
        {
          businessId: '74b58859-3a62-4b63-83d6-cc492b2c8e29',
          positionType: 'Cashier',
          status: Status.invited,
        },
      ],
      secondFactorRequired: false,
      unverifiedPeriodExpires: new Date(),
    } as any);

    await this.userModel.create({
      _id: this.userId4,
      email: 'rob+1@intveld.com',
      firstName: 'Rob+1',
      isActive: false,
      isVerified: false,
      lastName: 'Intveld+1',
      permissions: UsersFixture.createEmployeeRole(),
      secondFactorRequired: false,
      unverifiedPeriodExpires: new Date(),
    } as any);

    await this.userModel.create({
      _id: this.userId5,
      email: 'robb5@Intveld.com',
      firstName: 'Rob 5',
      isActive: false,
      isVerified: false,
      lastName: 'Intveld 5',
      permissions: UsersFixture.createEmployeeRole(),
      secondFactorRequired: false,
      unverifiedPeriodExpires: new Date(),
    } as any);
  }

  private async createEmployeeWithActiveAndInvitedStatuses(): Promise<void> {
    await this.userModel.create({
      _id: this.employeeId2,
      email: 'rob2@intveld.com',
      firstName: 'Rob',
      isActive: false,
      isVerified: false,
      lastName: 'Intveld',
      logo: '78ca2e67-4660-408b-9bf7-0687e9940208',
      permissions: UsersFixture.createEmployeeRole(),
      secondFactorRequired: false,
      unverifiedPeriodExpires: new Date(),
    } as any);

    await this.employeeModel.create({
      _id: this.employeeId2,
      email: 'rob2@intveld.com',
      firstName: 'Rob',
      isActive: false,
      isVerified: false,
      lastName: 'Intveld',
      logo: '78ca2e67-4660-408b-9bf7-0687e9940208',
      permissions: [
        {
          acls: [
            { microservice: 'checkout', create: true, read: true, update: true, delete: true },
            { microservice: 'connect', create: false, read: false, update: false, delete: false },
            { microservice: 'shipping', create: false, read: false, update: false, delete: false },
          ],
          businessId: '74b58859-3a62-4b63-83d6-cc492b2c8e29',
        },
      ],
      positions: [
        {
          businessId: '74b58859-3a62-4b63-83d6-cc492b2c8e29',
          positionType: 'Cashier',
          status: Status.active,
        },
        {
          businessId: '74b58859-3a62-4b63-83d6-cc492b2c8e30',
          positionType: 'Cashier',
          status: Status.invited,
        },
        {
          businessId: '74b58859-3a62-4b63-83d6-cc492b2c8e31',
          positionType: 'Cashier',
          status: Status.needApproval,
        },
      ],
      secondFactorRequired: false,
      unverifiedPeriodExpires: new Date(),
      userId: this.employeeId2,
    } as any);
  }


  private async createEmployeeNotRegistered(): Promise<void> {
    await this.employeeModel.create({
      _id: this.employeeId3,
      email: 'newuser.test@test.com',
      firstName: 'Test',
      isActive: false,
      isVerified: false,
      lastName: 'Test',
      logo: '78ca2e67-4660-408b-9bf7-0687e9940208',
      permissions: UsersFixture.createEmployeeRole(),
      positions: [
        {
          businessId: '74b58859-3a62-4b63-83d6-cc492b2c8e29',
          positionType: 'Cashier',
          status: Status.active,
        },
        {
          businessId: '84b58859-3a62-4b63-83d6-cc492b2c8e29',
          positionType: 'Cashier',
          status: Status.saved,
        },
      ],
      secondFactorRequired: false,
      unverifiedPeriodExpires: new Date(),
    } as any);
  }


  private async create2Fa(): Promise<void> {
    await this.employeeModel.create({
      _id: UsersFixture.secondFactorUserUuid,
      email: '2fa@example.com',
      firstName: '2FA',
      isActive: true,
      isVerified: true,
      lastName: '2FA',
      password: PasswordEncoder.encodePassword(defaultPassword, salt),
      permissions: UsersFixture.createMerchantEmployeeRole(),
      salt,
      secondFactorRequired: true,
      unverifiedPeriodExpires: new Date(),
      userId: UsersFixture.secondFactorUserUuid,
      positions: [
        {
          businessId: '74b58859-3a62-4b63-83d6-cc492b2c8e29',
          positionType: 'Cashier',
          status: Status.active,
        },
        {
          businessId: '84b58859-3a62-4b63-83d6-cc492b2c8e29',
          positionType: 'Cashier',
          status: Status.saved,
        },
      ],
    } as any);

    const _2faPermissionId: string = '71d3cdc8-2ec0-4f94-9123-74afde6898d4';

    await this.permissionModel.create({
      _id: _2faPermissionId,
      acls: [],
      userId: UsersFixture.secondFactorUserUuid,
      businessId: '74b58859-3a62-4b63-83d6-cc492b2c8e29',
    });

    await this.userModel.create({
      _id: UsersFixture.secondFactorUserUuid,
      email: '2fa@example.com',
      firstName: '2FA',
      isActive: true,
      isVerified: true,
      lastName: '2FA',
      password: PasswordEncoder.encodePassword(defaultPassword, salt),
      roles: [{
        name: 'merchant',
        permissions: _2faPermissionId,
      }],
      salt,
      secondFactorRequired: true,
      unverifiedPeriodExpires: new Date(),
    } as any);
  }

  private async createAdmin(): Promise<User> {
    return this.userModel.create({
      _id: UsersFixture.adminUuid,
      email: 'admin@payever.de',
      firstName: 'Rob',
      generalAccount: true,
      isActive: true,
      isVerified: true,
      lastName: 'Intveld',
      password: PasswordEncoder.encodePassword(defaultPassword, 'dBMgWbk3aAqDLnZmDq0U4ERZ/suVAzyug3cZrLn6ZSg'),
      roles: [UsersFixture.createAdminRole()],
      salt: 'dBMgWbk3aAqDLnZmDq0U4ERZ/suVAzyug3cZrLn6ZSg',
      unverifiedPeriodExpires: new Date(),
    } as any);
  }

  private async createMerchant(): Promise<User> {
    const merchantRoles: UserRoleMerchant = await this.createMerchantRole(UsersFixture.merchantUuid);
    const permission: any = await this.permissionModel.create({
      _id: '74b58859-3a62-4b63-83d6-cc492b2c8f29',
      acls: [{
        create: true,
        microservice: 'mail',
      }, {
        create: true,
        delete: true,
        microservice: 'shop',
        read: true,
        update: true,
      }],
      businessId: BUSINESS_2_ID,
      role: 'merchant',
      userId: UsersFixture.merchantUuid,
    });

    await this.permissionModel.create({
      _id: '74b58859-3a62-4b63-83d6-cc492b2c8e30',
      acls: [{
        create: true,
        microservice: 'mail',
      }, {
        create: true,
        delete: true,
        microservice: 'shop',
        read: true,
        update: true,
      }],
      businessId: '74b58859-3a62-4b63-83d6-cc492b2c8e30',
      role: 'merchant',
      userId: UsersFixture.merchantUuid,
    });

    return this.userModel.create({
      _id: UsersFixture.merchantUuid,
      email: 'merchant@example.com',
      firstName: 'Merchant',
      generalAccount: true,
      isActive: true,
      isVerified: true,
      lastName: 'Merchant',
      password: PasswordEncoder.encodePassword(defaultPassword, salt),
      roles: [
        {
          ...merchantRoles,
          permissions: [
            ...merchantRoles.permissions,
            permission._id,
          ],
        },
        {
          ...merchantRoles,
          permissions: [
            '74b58859-3a62-4b63-83d6-cc492b2c8e30',
          ],
        },
      ],
      salt: salt,
      unverifiedPeriodExpires: new Date(),
    } as any);
  }

  private async createMerchantRole(userId: string): Promise<UserRoleMerchant> {
    await this.permissionModel.create({
      _id: '74b58859-3a62-4b63-83d6-cc492b2c8e29',
      acls: [],
      businessId: '74b58859-3a62-4b63-83d6-cc492b2c8e29',
      role: 'merchant',
      userId,
    });

    return {
      name: RolesEnum.merchant,
      permissions: [
        '74b58859-3a62-4b63-83d6-cc492b2c8e29',
      ],
    } as any;
  }

  private static createMerchantEmployeeRole(): Permission[] {
    return [
      {
        acls: [],
        businessId: '74b58859-3a62-4b63-83d6-cc492b2c8e29',
      } as Permission,
    ];
  }

  private static groupAcl(businessId:string): Permission[]{    
    return [
      {
        acls: [
          {
            "microservice": "site",
            "create": false,
            "read": false,
            "update": false,
            "delete": false
          },
          {
            "microservice": "message",
            "create": true,
            "read": true,
            "update": true,
            "delete": true
          },
          {
            "microservice": "checkout",
            "create": false,
            "read": false,
            "update": false,
            "delete": false
          },
          {
            "microservice": "connect",
            "create": false,
            "read": false,
            "update": false,
            "delete": false
          }
        ],
        businessId,
      } as Permission,
    ];
    
  }

  private static createEmployeeRole(): Permission[] {
    return [
      {
        acls: [
          {
            create: true,
            microservice: 'mail',
          },
        ],
        businessId: '74b58859-3a62-4b63-83d6-cc492b2c8e29',
      } as Permission,
      {
        acls: [
          {
            create: true,
            microservice: 'mail',
          },
        ],
        businessId: 'b3447aa2-8cce-478b-928f-e800ab0b9f3b',
      } as Permission,
    ];
  }

  private static createAdminRole(): UserRoleInterface {
    return {
      name: RolesEnum.admin,
    };
  }

  private async createEmployeeWithoutPassword(): Promise<void> {
    await this.employeeModel.create({
      _id: UsersFixture.employeeWithoutPassword,
      email: 'withoutpassword@example.com',
      isActive: false,
      isVerified: false,
      permissions: UsersFixture.createEmployeeRole(),
      unverifiedPeriodExpires: new Date(),
    } as any);
  }

  private async createEmployeeActivated(): Promise<void> {
    await this.userModel.create({
      _id: this.employeeId4,
      email: 'active.employee@payever.com',
      firstName: 'Employee',
      isActive: true,
      isVerified: true,
      lastName: 'Activated',
      logo: '78ca2e67-4660-408b-9bf7-0687e9940208',
      password: PasswordEncoder.encodePassword(defaultPassword, salt),
      permissions: UsersFixture.createEmployeeRole(),
      salt,
      secondFactorRequired: false,
      unverifiedPeriodExpires: new Date(),
    } as any);

    await this.employeeModel.create({
      _id: this.employeeId4,
      email: 'active.employee@payever.com',
      firstName: 'Employee',
      isActive: true,
      isVerified: true,
      lastName: 'Activated',
      logo: '78ca2e67-4660-408b-9bf7-0687e9940208',
      permissions: UsersFixture.createEmployeeRole(),
      positions: [
        {
          businessId: '74b58859-3a62-4b63-83d6-cc492b2c8e29',
          positionType: 'Cashier',
          status: Status.active,
        },
      ],
      secondFactorRequired: false,
      unverifiedPeriodExpires: new Date(),
      userId: this.employeeId4,
    } as any);
  }

  private async createUserForAdminApi(): Promise<void> {
    await this.userModel.create({
      _id: this.userId1,
      email: 'johnTheMerchant@example.com',
      firstName: 'john',
      isActive: true,
      isVerified: true,
      lastName: 'TheMerchant',
      logo: '78ca2e67-4660-408b-9bf7-0687e9940208',
      password: PasswordEncoder.encodePassword(defaultPassword, salt),
      permissions: [
        {
          acls: [
            {
              create: false,
              delete: false,
              microservice: 'pos',
              read: false,
              update: false,
            },
          ],
          businessId: '74b58859-3a62-4b63-83d6-cc492b2c8e29',
          positionType: 'Cashier',
          status: Status.active,
        },
      ],
      salt,
      secondFactorRequired: false,
      unverifiedPeriodExpires: new Date(),
    } as any);

    await this.userModel.create({
      _id: this.userId2,
      email: 'johnTheMerchant2@example.com',
      firstName: 'john',
      isActive: true,
      isVerified: true,
      lastName: 'TheMerchant2',
      logo: '78ca2e67-4660-408b-9bf7-0687e9940208',
      password: PasswordEncoder.encodePassword(defaultPassword, salt),
      permissions: [
        {
          acls: [
            {
              create: false,
              delete: false,
              microservice: 'pos',
              read: false,
              update: false,
            },
          ],
          businessId: '74b58859-3a62-4b63-83d6-cc492b2c8e29',
          positionType: 'Cashier',
          status: Status.active,
        },
      ],
      salt,
      secondFactorRequired: false,
      unverifiedPeriodExpires: new Date(),
    } as any);

    const permission: any = await this.permissionModel.create({
      _id: '8c4f61f6-d954-4ea0-8fc1-5eaa0419566a',
      acls: [
        {
          create: true,
          delete: true,
          microservice: 'pos',
          read: true,
          update: true,
        },
      ],
      businessId: '74b58859-3a62-4b63-83d6-cc492b2c8e29',
      role: RolesEnum.merchant,
      userId: this.userId3,
    });

    await this.userModel.create({
      _id: this.userId3,
      email: 'johnTheMerchant3@example.com',
      firstName: 'john',
      isActive: true,
      isVerified: true,
      lastName: 'TheMerchant3',
      logo: '78ca2e67-4660-408b-9bf7-0687e9940208',
      password: PasswordEncoder.encodePassword(defaultPassword, salt),
      permissions: [permission],
      roles: {
        name: RolesEnum.merchant,
        permissions: [
          permission.id,
        ],
      },
      salt,
      secondFactorRequired: false,
      unverifiedPeriodExpires: new Date(),
    } as any);
  }
}

export = UsersFixture;
