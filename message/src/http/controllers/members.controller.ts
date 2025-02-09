import {
  Controller,
  Get,
  Post,
  Param,
  Body,
  UseGuards,
  HttpCode,
  HttpStatus,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';
import {
  Roles,
  RolesEnum,
  ParamModel,
  JwtAuthGuard,
  User,
  UserTokenInterface,
  AbstractController,
  AclActionsEnum,
  Acl,
} from '@pe/nest-kit';
import { BusinessSchemaName, BusinessModel } from '@pe/business-kit';
import { MessagingTypeEnum, ChatMemberRoleEnum } from '@pe/message-kit';
import { FilterQuery } from 'mongoose';
import { IncludeMemberHttpRequestDto } from '../dto';
import {
  AbstractMessaging,
  CommonMessagingService,
  AbstractMessagingDocument,
  ChatMember,
  ChatOnlineMembersService,
} from '../../message/submodules/platform';
import {
  ProfileDocument,
  ProfileService,
  AddMemberMethodEnum,
  ChatOnlineMemberInterface,
} from '../../message';
import {
  MessagingHttpResponseDto,
  MemberResponseHttpResponseDto,
} from '../../message/dto';
import { GroupChatDocument } from '../../message/submodules/messaging/group-chats';
import {
  BUSINESS_ID_NON_GUARDED_PLACEHOLDER_C,
  BUSINESS_ID_PLACEHOLDER,
  GROUP_ID_PLACEHOLDER,
  USER_ID_PLACEHOLDER_C,
  USER_ID_PLACEHOLDER,
  CHAT_ID_PLACEHOLDER_C,
  MESSAGING_TYPE_PLACEHOLDER_C,
  CONVERSATION_ID_PLACEHOLDER_C,
  CONVERSATION_ID_PLACEHOLDER,
  MESSAGING_TYPE_PLACEHOLDER,
  CHAT_ID_PLACEHOLDER,
  CONTACT_ID_PLACEHOLDER,
  CONTACT_ID_PLACEHOLDER_C,
} from './const';
import { UserDocument, BusinessLocalDocument } from '../../projections/models';
import { VoteCodes } from '../../message/const';
import { UserSchemaName, UsersService } from '../../projections';
import { userToResponseDto, messagingToResponseDto } from '../../message/transformers';
import { profileToResponseDto } from '../transformers';

@Controller(`business/${BUSINESS_ID_NON_GUARDED_PLACEHOLDER_C}/messaging`)
@ApiTags('messaging/members')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
export class MembersController extends AbstractController {
  constructor(
    private readonly usersService: UsersService,
    private readonly commonMessagingService: CommonMessagingService,
    private readonly profileService: ProfileService,
    private readonly onlineMemebersService: ChatOnlineMembersService,
  ) {
    super();
  }

  //  Since weird nestjs bug patch method can't be applied here
  @Post(`${MESSAGING_TYPE_PLACEHOLDER_C}/${CHAT_ID_PLACEHOLDER_C}/members/${USER_ID_PLACEHOLDER_C}/update`)
  @Acl({ microservice: 'message', action: AclActionsEnum.update })
  @HttpCode(HttpStatus.OK)
  @Roles(RolesEnum.merchant, RolesEnum.user)
  public async updateMember(
    @User() userToken: UserTokenInterface,
    @ParamModel(BUSINESS_ID_NON_GUARDED_PLACEHOLDER_C, BusinessSchemaName) business: BusinessModel,
    @Param(BUSINESS_ID_PLACEHOLDER) swaggerBusinessId: string,
    @Param(MESSAGING_TYPE_PLACEHOLDER) swaggerType: string,
    @ParamModel({
      _id: CHAT_ID_PLACEHOLDER_C,
      type: MESSAGING_TYPE_PLACEHOLDER_C,
    }, AbstractMessaging.name) chat: AbstractMessagingDocument,
    @Param(CHAT_ID_PLACEHOLDER) swaggerChatId: string,
    @ParamModel({
      _id: USER_ID_PLACEHOLDER_C,
    }, UserSchemaName) userToUpdate: UserDocument,
    @Param(USER_ID_PLACEHOLDER) swaggerUserId: string,
    @Body() dto: IncludeMemberHttpRequestDto,
  ): Promise<void> {
    const member: ChatMember = AbstractMessaging.getMemberOfUser(chat, userToken.id);
    if (dto.role && member.role !== ChatMemberRoleEnum.Admin) {
      throw new BadRequestException(`You can't assign roles`);
    }
    await this.denyAccessUnlessGranted(
      VoteCodes.INCLUDE_MEMBER,
      chat,
      { userToken },
      `You have no permission to invite to ${chat.type} "${chat._id}"`,
    );
    await this.commonMessagingService.updateMember(
      chat,
      userToUpdate,
      {
        permissions: dto.permissions,
        role: dto.role,
      },
    );
  }

  @Post(`${MESSAGING_TYPE_PLACEHOLDER_C}/${CHAT_ID_PLACEHOLDER_C}/members/${USER_ID_PLACEHOLDER_C}/include`)
  @HttpCode(HttpStatus.OK)
  @Roles(RolesEnum.merchant, RolesEnum.user)
  public async includeMember(
    @User() userToken: UserTokenInterface,
    @ParamModel(BUSINESS_ID_NON_GUARDED_PLACEHOLDER_C, BusinessSchemaName) business: BusinessModel,
    @Param(BUSINESS_ID_PLACEHOLDER) swaggerBusinessId: string,
    @ParamModel({
      _id: CHAT_ID_PLACEHOLDER_C,
      type: MESSAGING_TYPE_PLACEHOLDER_C,
    }, AbstractMessaging.name) chat: AbstractMessagingDocument,
    @Param(GROUP_ID_PLACEHOLDER) swaggerGroupId: string,
    @ParamModel({
      _id: USER_ID_PLACEHOLDER_C,
    }, UserSchemaName) userToInvite: UserDocument,
    @Param(USER_ID_PLACEHOLDER) swaggerUserId: string,
    @Body() dto: IncludeMemberHttpRequestDto,
  ): Promise<void> {
    if (this.commonMessagingService.containMember(chat, userToInvite._id)) {
      throw new BadRequestException(`User already is a member of chat ${chat.title}`);
    }

    await this.denyAccessUnlessGranted(
      VoteCodes.INCLUDE_MEMBER,
      chat,
      { userToken },
      `You have no permission to invite to ${chat.type} "${chat._id}"`,
    );
    const member: ChatMember = AbstractMessaging.getMemberOfUser(chat, userToken.id);
    if (dto.role && ChatMember.isRoleHigherThen(dto.role, member.role)) {
      throw new BadRequestException(`You can't include members with higher roles than yours`);
    }
    const profile: ProfileDocument = await this.profileService.findById(userToInvite._id);
    await this.denyAccessUnlessGranted(
      VoteCodes.BECOME_MEMBER,
      chat,
      { user: userToInvite, profile },
      `User with id "${userToInvite._id}" forbids to be a member of ${chat.type} "${chat._id}"`,
    );

    await this.commonMessagingService.addMember(chat, userToInvite, {
      addMethod: AddMemberMethodEnum.INCLUDE,
      addedBy: userToken.id,
      role: dto.role,
      withInvitationLink: false,
    });
  }

  @Post(`${MESSAGING_TYPE_PLACEHOLDER_C}/${CHAT_ID_PLACEHOLDER_C}/members/${USER_ID_PLACEHOLDER_C}/exclude`)
  @HttpCode(HttpStatus.OK)
  @Roles(RolesEnum.merchant, RolesEnum.user)
  public async excludeMember(
    @ParamModel(BUSINESS_ID_NON_GUARDED_PLACEHOLDER_C, BusinessSchemaName, false) business: BusinessModel,
    @Param(BUSINESS_ID_PLACEHOLDER) swaggerBusinessId: string,
    @ParamModel({
      _id: CHAT_ID_PLACEHOLDER_C,
      type: MESSAGING_TYPE_PLACEHOLDER_C,
    }, AbstractMessaging.name) chat: GroupChatDocument,
    @Param(GROUP_ID_PLACEHOLDER) swaggerGroupId: string,
    @ParamModel({
      _id: USER_ID_PLACEHOLDER_C,
    }, UserSchemaName) userToExclude: UserDocument,
    @Param(USER_ID_PLACEHOLDER) swaggerUserId: string,
    @User() userToken: UserTokenInterface,
  ): Promise<void> {
    await this.denyAccessUnlessGranted(
      VoteCodes.EXCLUDE_MEMBER,
      chat,
      { userToken, userToExclude },
      `You have no permission to exclude from group "${chat._id}"`,
    );
    await this.commonMessagingService.removeMember(chat, userToExclude, { removedBy: userToken.id });
  }

  @Get(`${MESSAGING_TYPE_PLACEHOLDER_C}/${CONVERSATION_ID_PLACEHOLDER_C}/members`)
  @ApiResponse({ status: HttpStatus.OK, type: [MemberResponseHttpResponseDto] })
  @Roles(RolesEnum.merchant, RolesEnum.user)
  public async getMembers(
    @User() userToken: UserTokenInterface,
    @ParamModel(BUSINESS_ID_NON_GUARDED_PLACEHOLDER_C, BusinessSchemaName, false) business: BusinessLocalDocument,
    @Param(BUSINESS_ID_PLACEHOLDER) businessId: string,
    @Param(CONVERSATION_ID_PLACEHOLDER) chatId: string,
    @Param(MESSAGING_TYPE_PLACEHOLDER) type: MessagingTypeEnum,
  ): Promise<MemberResponseHttpResponseDto[]> {
    
    const user: UserDocument = await this.usersService.findById(userToken.id);
    const basicMessagingFilter: FilterQuery<AbstractMessagingDocument> =
      this.commonMessagingService.getMessagingFilter({
        business,
        user,
        userToken,
      });
    const chatFilter: FilterQuery<AbstractMessagingDocument> = {
      $and: [{
        _id: chatId,
        type,
      }, basicMessagingFilter],
    };
    const chat: AbstractMessagingDocument = await this.commonMessagingService.findOne(chatFilter);
    if (!chat) {
      throw new NotFoundException(`Chat with _id "${chatId}" not found`);
    }

    await this.denyAccessUnlessGranted(VoteCodes.READ_MESSAGING_MEMBERS, chat, { userToken });
    const usersFilter: FilterQuery<UserDocument> = this.commonMessagingService.getMessagingMembersFilter({
      chat,
      user: userToken,
    });
    const users: UserDocument[] = await this.usersService.find(usersFilter);
    const profileFilter: FilterQuery<ProfileDocument> = { _id: usersFilter._id };
    const userProfiles: ProfileDocument[] = await this.profileService.find(profileFilter);
    const response: MemberResponseHttpResponseDto[] = [];
    for (const userDocument of users) {
      const userProfile: ProfileDocument = userProfiles.find(
        (item: ProfileDocument) => item._id === userDocument._id,
      );
      const member: ChatMember = chat.members.find((memberItem: ChatMember) => memberItem.user === userDocument._id);
      response.push({
        permissions: member.permissions,
        profile: userProfile ? profileToResponseDto(userProfile) : null,
        role: member.role,
        user: userToResponseDto(userDocument),
      });
    }

    return response;
  }

  @Get(`/mutual/${USER_ID_PLACEHOLDER_C}`)
  @ApiResponse({ status: HttpStatus.OK, type: [MessagingHttpResponseDto] })
  @Roles(RolesEnum.merchant, RolesEnum.user)
  public async findMutualMessagingWithUser(
    @User() currentUser: UserTokenInterface,
    @ParamModel(BUSINESS_ID_NON_GUARDED_PLACEHOLDER_C, BusinessSchemaName) business: BusinessModel,
    @Param(BUSINESS_ID_PLACEHOLDER) swaggerBusinessId: string,
    @ParamModel({
      _id: USER_ID_PLACEHOLDER_C,
      businesses: BUSINESS_ID_NON_GUARDED_PLACEHOLDER_C,
    }, UserSchemaName) user: UserDocument,
    @Param(USER_ID_PLACEHOLDER) swaggerUserId: string,
  ): Promise<MessagingHttpResponseDto[]> {
    const mutualConversations: AbstractMessagingDocument[] = await this.commonMessagingService.find({
      $and: [{
        'members.user': currentUser.id,
      }, {
        'members.user': user._id,
      }],
      business: business._id,
    });

    return mutualConversations.map((chat: AbstractMessagingDocument) => {
      return messagingToResponseDto(chat, {
        forUser: currentUser.id,
      });
    });
  }

  @Get(`${MESSAGING_TYPE_PLACEHOLDER_C}/${CONVERSATION_ID_PLACEHOLDER_C}/members/user/${USER_ID_PLACEHOLDER_C}`)
  @ApiResponse({ status: HttpStatus.OK, type: [MemberResponseHttpResponseDto] })
  @Roles(RolesEnum.merchant, RolesEnum.user)
  public async getMemberInfoByUserId(
    @User() userToken: UserTokenInterface,
    @ParamModel(BUSINESS_ID_NON_GUARDED_PLACEHOLDER_C, BusinessSchemaName, false) business: BusinessLocalDocument,
    @Param(BUSINESS_ID_PLACEHOLDER) businessId: string,
    @Param(CONVERSATION_ID_PLACEHOLDER) chatId: string,
    @Param(MESSAGING_TYPE_PLACEHOLDER) type: MessagingTypeEnum,
    @Param(USER_ID_PLACEHOLDER) userId: string,
  ): Promise<ChatOnlineMemberInterface> {
    const user: UserDocument = await this.usersService.findById(userToken.id);
    const basicMessagingFilter: FilterQuery<AbstractMessagingDocument> =
      this.commonMessagingService.getMessagingFilter({
        business,
        user,
        userToken,
      });
    const chatFilter: FilterQuery<AbstractMessagingDocument> = {
      $and: [{
        _id: chatId,
        type,
      }, basicMessagingFilter],
    };
    const chat: AbstractMessagingDocument = await this.commonMessagingService.findOne(chatFilter);

    if (!chat) {
      throw new NotFoundException(`Chat with _id "${chatId}" not found`);
    }

    await this.denyAccessUnlessGranted(VoteCodes.READ_MESSAGING_MEMBERS, chat, { userToken });

    return this.onlineMemebersService.getMember(userId, null);
  }

  @Get(`${MESSAGING_TYPE_PLACEHOLDER_C}/${CONVERSATION_ID_PLACEHOLDER_C}/members/contact/${CONTACT_ID_PLACEHOLDER_C}`)
  @ApiResponse({ status: HttpStatus.OK, type: [MemberResponseHttpResponseDto] })
  @Roles(RolesEnum.merchant, RolesEnum.user)
  public async getMemberInfoByContactId(
    @User() userToken: UserTokenInterface,
    @ParamModel(BUSINESS_ID_NON_GUARDED_PLACEHOLDER_C, BusinessSchemaName, false) business: BusinessLocalDocument,
    @Param(BUSINESS_ID_PLACEHOLDER) businessId: string,
    @Param(CONVERSATION_ID_PLACEHOLDER) chatId: string,
    @Param(MESSAGING_TYPE_PLACEHOLDER) type: MessagingTypeEnum,
    @Param(CONTACT_ID_PLACEHOLDER) contactId: string,
  ): Promise<ChatOnlineMemberInterface> {
    const user: UserDocument = await this.usersService.findById(userToken.id);
    const basicMessagingFilter: FilterQuery<AbstractMessagingDocument> =
      this.commonMessagingService.getMessagingFilter({
        business,
        user,
        userToken,
      });
    const chatFilter: FilterQuery<AbstractMessagingDocument> = {
      $and: [{
        _id: chatId,
        type,
      }, basicMessagingFilter],
    };
    const chat: AbstractMessagingDocument = await this.commonMessagingService.findOne(chatFilter);

    if (!chat) {
      throw new NotFoundException(`Chat with _id "${chatId}" not found`);
    }

    await this.denyAccessUnlessGranted(VoteCodes.READ_MESSAGING_MEMBERS, chat, { userToken });

    return this.onlineMemebersService.getMember(null, contactId);
  }
}
