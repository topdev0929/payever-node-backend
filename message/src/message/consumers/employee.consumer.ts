import { Controller } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { MemberSyncService } from '../services';
import { ChannelRmqEventsEnum, RabbitChannelsEnum, EmployeeRmqMessagesEnum, UserRmqMessagesEnum } from '../enums';
import { CommonChannelDocument } from '../submodules/messaging/common-channels';

@Controller()
export class EmployeeConsumer {
  constructor(private readonly channelMemberSyncService: MemberSyncService) {
  }

  @MessagePattern({
    channel: RabbitChannelsEnum.Message,
    name: EmployeeRmqMessagesEnum.EmployeeConfirmInBusiness,
  })
  public async onEmployeeConfirmedBusiness(
    data: {
      businessId: string;
      employee: {
        first_name: string;
        last_name: string;
        userId: string;
      };
    },
  ): Promise<void> {
    await this.channelMemberSyncService.addEmployeeToBusinessChannels(data.businessId, {
      first_name: data.employee.first_name,
      id: data.employee.userId,
      last_name: data.employee.last_name,
    });
  }

  @MessagePattern({
    channel: RabbitChannelsEnum.Message,
    name: UserRmqMessagesEnum.UserCreated,
  })
  public async onUserRegistered(
    data: {
      _id: string;
      businesses: Array<{ _id: string }>;
      userAccount: {
        firstName: string;
        lastName: string;
      };
    },
  ): Promise<void> {
    if (!data || data.businesses.length === 0 || !data._id) {
      return;
    }
    await Promise.all(data.businesses.map((business: { _id: string }): Promise<void> =>
      this.channelMemberSyncService.addEmployeeToBusinessChannels(business._id, {
        first_name: data.userAccount?.firstName,
        id: data._id,
        last_name: data.userAccount?.lastName,
      }),
    ));
  }

  @MessagePattern({
    channel: RabbitChannelsEnum.Message,
    name: EmployeeRmqMessagesEnum.EmployeeRemoved,
  })
  public async onEmployeeRemovedFromBusiness(
    data: {
      businessId: string;
      employee: {
        first_name: string;
        last_name: string;
        userId: string;
      };
    },
  ): Promise<void> {
    await this.channelMemberSyncService.removeEmployeeFromChannel(data.businessId, {
      first_name: data.employee.first_name,
      id: data.employee.userId,
      last_name: data.employee.last_name,
    });
  }

  @MessagePattern({
    channel: RabbitChannelsEnum.Message,
    name: ChannelRmqEventsEnum.ChannelCreated,
  })
  public async onChannelCreated(
    data: {
      channel: CommonChannelDocument;
    },
  ): Promise<void> {
    await this.channelMemberSyncService.addOwnerToChannel(data.channel);
  }
}
