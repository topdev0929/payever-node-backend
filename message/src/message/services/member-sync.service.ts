import { Injectable } from '@nestjs/common';
import { ChatMember, CommonMessagingService } from '../submodules/platform';
import { ChatMemberRoleEnum, MessagingTypeEnum } from '@pe/message-kit';
import { UserDocument, UsersService } from '../../projections';
import { CommonChannelDocument } from '../submodules/messaging/common-channels';
import { AddMemberMethodEnum } from '../enums';
import { BusinessService } from '@pe/business-kit';

@Injectable()
export class MemberSyncService {
  constructor(
    private readonly commonMessagingService: CommonMessagingService,
    private readonly usersService: UsersService,
    private readonly businessService: BusinessService,
  ) {

  }

  public async addEmployeeToBusinessChannels(businessId: string, employee: {
    id: string;
    first_name?: string;
    last_name?: string;
  }): Promise<void> {
    const business: any = await this.businessService.findOneById(businessId);

    if (!business) {
      return;
    }

    const channels: CommonChannelDocument[] = await this.getBusinessChannels(businessId, business.owner);

    const user: UserDocument = await this.findOrCreateUser(
      employee.id,
      employee.first_name,
      employee.last_name,
    );

    await Promise.all(channels.map(async (channel: CommonChannelDocument) => {
      if (this.isUserInRemovedMembers(channel, user)) {
        return;
      }

      if (this.commonMessagingService.containMember(channel, user.id)) {
        return;
      }

      await this.commonMessagingService.addMember(channel, user, {
        addMethod: AddMemberMethodEnum.INITIAL,
        addedBy: business.owner,
        role: ChatMemberRoleEnum.Member,
        withInvitationLink: false,
      });
    }));
  }

  public async addOwnerToChannel(channel: CommonChannelDocument): Promise<void> {
    const users: UserDocument[] = await this.usersService.find({
      businesses: channel.business,
    }) as any;

    if (channel.type !== MessagingTypeEnum.Channel) {
      return;
    }

    const business: any = await this.businessService.findOneById(channel.business);

    if (!business) {
      return;
    }

    const owner: UserDocument = users.find((user: UserDocument) => business.owner === user.id);

    await this.commonMessagingService.addMember(channel, owner, {
      addMethod: AddMemberMethodEnum.INITIAL,
      addedBy: business.owner,
      role: ChatMemberRoleEnum.Admin,
      withInvitationLink: false,
    });
  }

  public async removeEmployeeFromChannel(businessId: string, employee: {
    first_name?: string;
    id: string;
    last_name?: string;
  }): Promise<void> {
    const business: any = await this.businessService.findOneById(businessId);

    if (!business) {
      return;
    }

    const channels: CommonChannelDocument[] = await this.getBusinessChannels(businessId, business.owner);

    await Promise.all(channels.map(async (channel: CommonChannelDocument) => {
      if (!this.commonMessagingService.containMember(channel, employee.id)) {
        return;
      }
      const user: UserDocument = await this.findOrCreateUser(
        employee.id,
        employee.first_name,
        employee.last_name,
      );
      await this.commonMessagingService.removeMember(channel, user, {
        removedBy: business.owner,
      });
    }));
  }

  private isUserInRemovedMembers(channel: CommonChannelDocument, user: UserDocument): boolean {
    return !!channel.removedMembers.find((member: ChatMember) => member.user === user.id);
  }

  private async findOrCreateUser(employeeId: string, first_name: string, last_name: string): Promise<UserDocument> {
    return this.usersService.update({
      _id: employeeId,
      userAccount: {
        firstName: first_name,
        lastName: last_name,
      },
    } as UserDocument, true);
  }

  private getBusinessChannels(businessId: string, businessOwner: string): Promise<CommonChannelDocument[]> {
    return this.commonMessagingService.find({
      business: businessId,
      deleted: { $ne: true },
      'members.user': businessOwner,
      type: MessagingTypeEnum.Channel,
    }) as any;
  }
}
