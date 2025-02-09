import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Query, Model } from 'mongoose';
import { LoginAttemptSchemaName, RegisterAttemptSchemaName, SecurityQuestionAttemptSchemaName } from '../schemas';
import { BlockListInterface } from '../interfaces/block-list.interface';
import { BlockListSchemaName } from '../schemas/block-list.schema';
import { BanReasonsEnum, getReasonFromBanCount } from '../enums/ban-reasons';
import {
  MAX_LOGIN_FAILURES,
  MAX_REGISTER_ATTEMPTS,
  MAX_REGISTER_ATTEMPTS_NEXT,
  MAX_SECURITY_QUESTION_FAILURES,
  THREE_HOURS,
  TWENTY_MINUTES,
} from '../constants/bruteforce';
import { MAX_BAN_COUNT, SECURITY_QUESTION_BAN } from '../constants/ban-reasons';
import { BlockListModel } from '../models/block-list.model';
import { BlockedException, RegisterBlockedException } from '../exceptions';
import { environment } from '../../environments';
import { LoginAttemptInterface, SecurityQuestionAttemptInterface } from '../interfaces';
import { RegisterAttemptModel, LoginAttemptModel, SecurityQuestionAttemptModel } from '../models';
import { BanRegistrationsEnum, getRegistrationBanFromCount } from '../enums/ban-register';
import { IpAddressEncoder, UserService } from '../../users';
import { User } from '../../users/interfaces';
import { StringTools } from '../tools/string-tools';
import { EmployeeSchemaName } from '../../employees/schemas';
import { Employee } from '../../employees/interfaces';
import { SecurityQuestionService } from './security-question.service';

@Injectable()
export class SuspiciousActivityService {
  constructor(
    private readonly securityQuestionService: SecurityQuestionService,
    @InjectModel(LoginAttemptSchemaName) private readonly loginAttemptModel: LoginAttemptModel,
    @InjectModel(BlockListSchemaName) private readonly blockListModel: BlockListModel,
    @InjectModel(RegisterAttemptSchemaName) private readonly registerAttemptModel: RegisterAttemptModel,
    private readonly userService: UserService,
    @InjectModel(EmployeeSchemaName) private readonly employeeModel: Model<Employee>,
    @InjectModel(SecurityQuestionAttemptSchemaName)
    private readonly securityQuestionAttemptModel: SecurityQuestionAttemptModel,
  ) { }

  // Login

  public async checkLoginSuspiciousActivity(
    userId: string,
    userEmail: string,
    isEmployee: boolean,
    ipAddress: string,
  ): Promise<number | never> {
    if (!environment.enableBruteforceProtection) {
      return;
    }

    const isPermanentlyBlocked: boolean = await this.blockListModel.isPermanentlyBlocked(userId, ipAddress);
    if (isPermanentlyBlocked) {
      throw new BlockedException(BanReasonsEnum.REASON_PERMANENT_BAN);
    }

    const maxBlock: number = await this.blockListModel.getActiveBanCount(userId, ipAddress);

    if (isEmployee && userEmail && maxBlock === 1) {
      const employee: any = await this.employeeModel.findOne({ email: userEmail, isActive: false });

      if (employee) {
        return maxBlock;
      }
    }


    if (maxBlock > 1) {
      const banReason: BanReasonsEnum = getReasonFromBanCount(maxBlock);
      throw new BlockedException(banReason);
    }

    return this.bruteforceBanCountLogin(userId, ipAddress);
  }

  // security question
  public async checkSecurityQuestionSuspiciousActivity(
    userId: string,
    ipAddress: string,
  ): Promise<number | never> {
    if (!environment.enableBruteforceProtection) {
      return;
    }

    const maxBlock: number = await this.blockListModel.getActiveBanCount(userId, ipAddress);

    if (maxBlock > 1) {
      throw new UnauthorizedException(SECURITY_QUESTION_BAN);
    }

    return this.bruteforceBanCountSecurityQuestion(userId, ipAddress);
  }

  // Register

  public async checkRegisterSuspiciousActivity(ipAddress: string): Promise<number | never> {
    if (!environment.enableBruteforceProtection) {
      return;
    }

    const isPermanentlyBlocked: boolean = await this.blockListModel.isIpBlocked(ipAddress);
    if (isPermanentlyBlocked) {
      throw new RegisterBlockedException(BanRegistrationsEnum.REGISTRATION_PERMANENT_BAN);
    }

    const maxBlock: number = await this.blockListModel.getActiveBanCount(null, ipAddress);
    if (maxBlock > 1) {
      const banReason: BanRegistrationsEnum = getRegistrationBanFromCount(maxBlock);
      throw new RegisterBlockedException(banReason);
    }

    return this.bruteforceBanCountRegister(ipAddress, maxBlock);
  }

  public async clearLoginFailures(userId: string, ipAddress: string): Promise<void> {
    await this.loginAttemptModel.clearLoginFailures(userId, ipAddress);
  }

  public async removeUserFromBlockList(userId: string): Promise<void> {
    await this.blockListModel.deleteMany({ user: userId });
  }

  public async blockIp(userIp: string): Promise<void> {
    const blockedModel: BlockListInterface = await this.blockListModel.findOneAndUpdate(
      { ipAddress: IpAddressEncoder.encodeUsersIpAddress(userIp, '') },
      {
        $inc: { banCount: 1 },
        $set: {
          blockedToDate: new Date(),
          permanently: true,
        },
      });
    if (!blockedModel) {
      await this.blockListModel.create({
        banCount: 1,
        blockedToDate: new Date(),
        ipAddress: IpAddressEncoder.encodeUsersIpAddress(userIp, ''),
        permanently: true,
      });
    }
  }

  public async unblockUser(userId?: string, userIp?: string): Promise<void> {
    if (StringTools.isValidString(userIp) && StringTools.isValidString(userId)) {
      const user: User = await this.userService.findOneBy({ _id: userId });
      const email: string = user.email;
      const encodedIp: string = IpAddressEncoder.encodeUsersIpAddress(userIp, email);
      await this.clearUserActivities(userId, encodedIp);
    } else if (StringTools.isValidString(userId)) {
      await this.clearUserActivitiesById(userId);
    } else if (StringTools.isValidString(userIp)) {
      const encodedIp: string = IpAddressEncoder.encodeUsersIpAddress(userIp, '');
      await this.clearUserActivitiesByIp(encodedIp);
    }
  }

  public async clearAllActivities(): Promise<void> {
    await this.clearAllRegisterFailures();
    await this.clearAllLoginFailures();
    await this.clearAllSecurityQuestionFailures();
    await this.clearAllBlockedLists();
  }

  public async isIpBlockedPermanently(ipAddress: string): Promise<boolean> {
    return !! await this.blockListModel.findOne({
      ipAddress: IpAddressEncoder.encodeUsersIpAddress(ipAddress, ''),
      permanently: true,
    });
  }

  private async bruteforceBanCountLogin(userId: string, ipAddress: string): Promise<number> {
    const query: any = {
      ipAddress,
      success: false,
    };
    if (userId) {
      query.user = userId;
    }
    const promises: Array<Query<number, any>> = [
      this.loginAttemptModel.countDocuments(query),
    ];

    if (userId) {
      promises.push(
        this.loginAttemptModel.countDocuments({
          success: false,
          user: userId,
        }),
      );
    }

    const [ipAddressFailures, userFailures]: number[] = await Promise.all(promises);

    if (userFailures > MAX_LOGIN_FAILURES || ipAddressFailures > MAX_LOGIN_FAILURES) {
      return (await this.blockLogin(userId, ipAddress)).banCount;
    }

    return 0;
  }

  private async blockLogin(userId?: string, ipAddress?: string): Promise<BlockListInterface> {
    let nextBlock: number = await this.blockListModel.getMaxBlockIn24Hrs(userId, ipAddress) + 1;

    if (await this.isLoginBruteforced(userId)) {
      nextBlock++;
    }

    await this.loginAttemptModel.clearLoginFailures(userId, ipAddress);
    let blockedToDate: Date = new Date(new Date().getTime() + TWENTY_MINUTES);

    if (nextBlock > 2) {
      blockedToDate = new Date(new Date().getTime() + THREE_HOURS);
    }

    if (nextBlock === MAX_BAN_COUNT) {
      return this.blockListModel.create({
        banCount: nextBlock,
        blockedToDate,
        ipAddress,
        permanently: true,
        user: userId,
      });
    }

    return this.blockListModel.create({
      banCount: nextBlock,
      blockedToDate,
      ipAddress,
      user: userId,
    });
  }

  private async isLoginBruteforced(userId?: string): Promise<boolean> {
    const loginAttempts: LoginAttemptInterface[] = await this.loginAttemptModel.find({ user: userId }).exec();

    let ipAddress: string;
    for (const loginAttempt of loginAttempts) {
      if (loginAttempt.ipAddress) {
        if (ipAddress && ipAddress !== loginAttempt.ipAddress) {
          return true;
        }
        ipAddress = loginAttempt.ipAddress;
      }
    }

    return false;
  }

  private async bruteforceBanCountRegister(ipAddress: string, maxBlock: number): Promise<number> {
    const ipAddressFailures: number = await this.registerAttemptModel.countDocuments({
      ipAddress,
    }).exec();

    if (ipAddressFailures > MAX_REGISTER_ATTEMPTS) {
      return (await this.blockRegister(ipAddress, maxBlock)).banCount;
    }

    return maxBlock;
  }

  private async blockRegister(ipAddress: string, maxBlock: number): Promise<BlockListInterface> {
    let nextBlock: number = await this.blockListModel.getMaxBlockIn24Hrs(null, ipAddress) + 1;

    if (await this.isRegisterBruteforced(ipAddress)) {
      nextBlock++;
    }

    if (nextBlock === 1 && maxBlock === 1) {
      nextBlock++;
    }

    let blockedToDate: Date = new Date(new Date().getTime() + TWENTY_MINUTES);

    await this.registerAttemptModel.clearRegisterAttemptsByIpAddress(ipAddress);
    if (nextBlock > 2) {
      blockedToDate = new Date(new Date().getTime() + THREE_HOURS);
    }

    if (nextBlock === MAX_BAN_COUNT) {
      return this.blockListModel.create({
        banCount: nextBlock,
        blockedToDate,
        ipAddress,
        permanently: true,
      });
    }

    return this.blockListModel.create({
      banCount: nextBlock,
      blockedToDate,
      ipAddress,
    });
  }

  private async isRegisterBruteforced(ipAddress?: string): Promise<boolean> {
    if (!ipAddress) {
      return true;
    }

    const registerAttempts: number = await this.registerAttemptModel.countDocuments({ ipAddress }).exec();

    return registerAttempts > MAX_REGISTER_ATTEMPTS_NEXT;
  }

  private async bruteforceBanCountSecurityQuestion(userId: string, ipAddress: string): Promise<number> {
    const query: any = {
      ipAddress,
      success: false,
    };
    if (userId) {
      query.user = userId;
    }
    const promises: Array<Query<number, any>> = [
      this.securityQuestionAttemptModel.countDocuments(query),
    ];

    if (userId) {
      promises.push(
        this.securityQuestionAttemptModel.countDocuments({
          success: false,
          user: userId,
        }),
      );
    }

    const [ipAddressFailures, userFailures]: number[] = await Promise.all(promises);

    if (userFailures > MAX_SECURITY_QUESTION_FAILURES || ipAddressFailures > MAX_SECURITY_QUESTION_FAILURES) {
      return (await this.blockSecurityQuestion(userId, ipAddress)).banCount;
    }

    return 0;
  }

  private async blockSecurityQuestion(userId?: string, ipAddress?: string): Promise<BlockListInterface> {
    let nextBlock: number = await this.blockListModel.getMaxBlockIn24Hrs(userId, ipAddress) + 1;

    if (await this.isSecurityQuestionBruteforced(userId)) {
      nextBlock++;
    }
    const blockedToDate = new Date(new Date().getTime() + THREE_HOURS);

    return this.blockListModel.create({
      banCount: nextBlock,
      blockedToDate,
      ipAddress,
      user: userId,
    });
  }

  private async isSecurityQuestionBruteforced(userId?: string): Promise<boolean> {
    const attempts: SecurityQuestionAttemptInterface[] =
      await this.securityQuestionAttemptModel.find({ user: userId }).exec();

    let ipAddress: string;
    for (const attempt of attempts) {
      if (attempt.ipAddress) {
        if (ipAddress && ipAddress !== attempt.ipAddress) {
          return true;
        }
        ipAddress = attempt.ipAddress;
      }
    }

    return false;
  }

  private async clearAllLoginFailures(): Promise<void> {
    await this.loginAttemptModel.deleteMany({ });
  }

  private async clearAllRegisterFailures(): Promise<void> {
    await this.registerAttemptModel.deleteMany({ });
  }

  private async clearAllSecurityQuestionFailures(): Promise<void> {
    await this.securityQuestionAttemptModel.deleteMany({ });
  }

  private async clearAllBlockedLists(): Promise<void> {
    await this.blockListModel.deleteMany({ });
  }

  private async clearUserActivities(userId: string, encodedIp: string): Promise<void> {
    await this.blockListModel.deleteMany({ ipAddress: encodedIp, user: userId });
    await this.registerAttemptModel.deleteMany({ ipAddress: encodedIp, user: userId });
    await this.loginAttemptModel.deleteMany({ ipAddress: encodedIp, user: userId });
    await this.securityQuestionAttemptModel.deleteMany({ ipAddress: encodedIp, user: userId });
  }

  private async clearUserActivitiesByIp(encodedIp: string): Promise<void> {
    await this.blockListModel.deleteMany({ ipAddress: encodedIp });
    await this.registerAttemptModel.clearRegisterAttemptsByIpAddress(encodedIp);
    await this.loginAttemptModel.clearLoginFailures(null, encodedIp);
    await this.securityQuestionService.clearLoginFailures(null, encodedIp);
  }

  private async clearUserActivitiesById(userId: string): Promise<void> {
    await this.blockListModel.deleteMany({ user: userId });
    await this.registerAttemptModel.clearRegisterAttemptsByUserId(userId);
    await this.loginAttemptModel.clearLoginFailures(userId, null);
    await this.securityQuestionService.clearLoginFailures(userId, null);
  }
}
