import { BaseFixture } from '@pe/cucumber-sdk/module';
import { RolesEnum, UserRoleMerchant } from '@pe/nest-kit';
import { Model } from 'mongoose';
import { PasswordEncoder } from '../../../src/users/tools';
import { Permission, User } from '../../../src/users/interfaces';

const defaultPassword: string = '12345678';
const salt: string = 'uxG7ynPrh0YoyOPQTNo6VwYv9tqiQ7DFtaflNBm/PZA';

class UsersFixture extends BaseFixture {
  public static bannedCaptcha: string = 'ac031fc5-43d8-4e17-a07b-daa1c3b8ea81';
  public static bannedFor20Minutes: string = 'ac031fc5-43d8-4e17-a07b-daa1c3b8ea82';
  public static bannedFor3Hours: string = 'ac031fc5-43d8-4e17-a07b-daa1c3b8ea83';
  public static permanentlyBanned: string = 'ac031fc5-43d8-4e17-a07b-daa1c3b8ea84';
  public static bannedEmployee: string = '787e4b36-ecfa-4e86-a915-d06fb21f4ed3';
  public static bannedEmployeeEmail: string = 'active.employee@payever.com';


  private readonly userModel: Model<User> = this.application.get('UserModel');
  private readonly permissionModel: Model<Permission> = this.application.get('PermissionModel');

  public async apply(): Promise<void> {
    await this.createBannedCaptcha();
    await this.createBanned20Minutes();
    await this.createBanned3Hours();
    await this.createPermanentlyBanned();
  }

  private async createBannedCaptcha(): Promise<User> {
    return this.userModel.create({
      _id: UsersFixture.bannedCaptcha,
      email: 'banned-captcha@example.com',
      firstName: 'Merchant',
      isActive: true,
      isVerified: true,
      lastName: 'Merchant',
      password: PasswordEncoder.encodePassword(defaultPassword, salt),
      roles: [await this.createMerchantRole(UsersFixture.bannedCaptcha)],
      salt,
      unverifiedPeriodExpires: new Date(),
    });
  }

  private async createBanned20Minutes(): Promise<User> {
    return this.userModel.create({
      _id: UsersFixture.bannedFor20Minutes,
      email: 'banned20@example.com',
      firstName: 'Merchant',
      isActive: true,
      isVerified: true,
      lastName: 'Merchant',
      password: PasswordEncoder.encodePassword(defaultPassword, salt),
      roles: [await this.createMerchantRole(UsersFixture.bannedFor20Minutes)],
      salt,
      unverifiedPeriodExpires: new Date(),
    });
  }

  private async createBanned3Hours(): Promise<User> {
    return this.userModel.create({
      _id: UsersFixture.bannedFor3Hours,
      email: 'banned3Hours@example.com',
      firstName: 'Merchant',
      isActive: true,
      isVerified: true,
      lastName: 'Merchant',
      password: PasswordEncoder.encodePassword(defaultPassword, salt),
      roles: [await this.createMerchantRole(UsersFixture.bannedFor3Hours)],
      salt,
      unverifiedPeriodExpires: new Date(),
    });
  }

  private async createPermanentlyBanned(): Promise<User> {
    return this.userModel.create({
      _id: UsersFixture.permanentlyBanned,
      email: 'bannedPermanently@example.com',
      firstName: 'Merchant',
      isActive: true,
      isVerified: true,
      lastName: 'Merchant',
      password: PasswordEncoder.encodePassword(defaultPassword, salt),
      roles: [await this.createMerchantRole(UsersFixture.permanentlyBanned)],
      salt,
      unverifiedPeriodExpires: new Date(),
    });
  }

  private async createMerchantRole(userId: string): Promise<UserRoleMerchant> {
    await this.permissionModel.create({
      _id: userId,
      acls: [],
      businessId: '74b58859-3a62-4b63-83d6-cc492b2c8e29',
      role: 'merchant',
      userId,
    });

    return {
      name: RolesEnum.merchant,
      permissions: [
        userId,
      ],
    } as any;
  }
}

export = UsersFixture;
