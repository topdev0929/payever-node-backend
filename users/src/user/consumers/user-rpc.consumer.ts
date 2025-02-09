import { Controller } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';

import { MessageBusChannelsEnum, UserRabbitMessagesEnum } from '../enums';
import { UserService } from '../services';
import { UserModel } from '../models';
import { UserAccountInterface } from '../interfaces';
import { RolesEnum, UserTokenInterface } from '@pe/nest-kit';
import { environment } from '../../environments';
import { MailerEventProducer } from '../producers';
import { UserInfoDto } from '../dto/create-user-account';


@Controller()
export class UserRpcConsumer {
  constructor(
    private readonly userService: UserService,
    private readonly mailerEventProducer: MailerEventProducer,
  ) { }

  @MessagePattern({
    channel: MessageBusChannelsEnum.users,
    name: UserRabbitMessagesEnum.RpcAuthUserRegistered,
  })
  public async create(
    dto: { userToken: UserTokenInterface; userInfo: UserInfoDto },
  ): Promise<UserAccountInterface & { _id: string }> {
    const { id, firstName, lastName, email }: any = dto.userToken;

    const userInfo: UserInfoDto = dto.userInfo;

    const userModel: UserModel = await this.userService.createUserAccount(
      id,
      {
        email,
        firstName,
        hasUnfinishedBusinessRegistration: userInfo.hasUnfinishedBusinessRegistration || false,
        language: userInfo.language || 'en',
        lastName,
        registrationOrigin: userInfo.registrationOrigin || {
          account: '',
          url: '',
        },
        shippingAddresses: [],
      } as UserAccountInterface,
    );

    if (userInfo.registrationOrigin?.account === RolesEnum.merchant) {
      await this.mailerEventProducer.produceMerchantRegistrationEmailMessage(
        dto.userToken,
        userInfo,
        environment.adminEmail,
      );
    }

    return { ...userModel.toObject().userAccount, _id: userModel._id };
  }
}
