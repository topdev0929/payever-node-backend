import {
  Controller,
  Get,
  Post,
  Param,
  UseGuards,
  HttpCode,
  HttpStatus,
  NotFoundException,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
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
  RedisClient,
} from '@pe/nest-kit';
import { ChatMemberRoleEnum } from '@pe/message-kit';
import { messagingToResponseDto } from '../../message/transformers';
import {
  AbstractMessagingDocument,
  CommonMessagingService,
  ChatMember,
  GuestUserInterface,
} from '../../message/submodules/platform';
import { ChatInviteDocument, ChatInviteSchemaName } from '../../message/submodules/invites';
import {
  InvitationHttpResponseDto,
} from '../dto';
import {
  MessagingHttpResponseDto,
} from '../../message/dto';
import {
  CHAT_INVITE_CODE_PLACEHOLDER_C,
  CHAT_INVITE_CODE_PLACEHOLDER,
} from './const';
import { AddMemberMethodEnum } from '../../message';
import { UsersService } from '../../projections';
import { UserDocument } from '../../projections/models';

@Controller(`invitations`)
@ApiTags('invitations')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Roles(RolesEnum.admin, RolesEnum.merchant, RolesEnum.anonymous)
export class InvitationController extends AbstractController {
  constructor(
    private readonly commonMessagingService: CommonMessagingService,
    private readonly usersService: UsersService,
    private readonly clientRedis: RedisClient,
  ) {
    super();
  }

  @Get(CHAT_INVITE_CODE_PLACEHOLDER_C)
  @ApiResponse({ status: HttpStatus.OK, type: InvitationHttpResponseDto })
  public async getInvitation(
    @Param(CHAT_INVITE_CODE_PLACEHOLDER) swagger_code: string,
    @ParamModel({
      $or: [{
        expiresAt: { $lte: new Date() },
      }, {
        expiresAt: { $exists: false },
      }],
      code: CHAT_INVITE_CODE_PLACEHOLDER_C,
      deleted: { $ne: true },
    }, ChatInviteSchemaName) invitation: ChatInviteDocument,
  ): Promise<InvitationHttpResponseDto> {
    const messaging: AbstractMessagingDocument = await this.commonMessagingService.findOne({
      _id: invitation.chat,
      deleted: { $ne: true },
    });

    if (!messaging) {
      throw new NotFoundException(`Messaging by invitation code "${invitation.code}" not found`);
    }

    return {
      code: invitation.code,
      messaging: {
        _id: messaging._id,
        // tslint:disable-next-line: no-string-literal
        photo: messaging.photo,
        title: messaging.title,
        type: messaging.type,
      },
    };
  }

  @ApiResponse({ status: HttpStatus.OK, type: MessagingHttpResponseDto })
  @Post(`${CHAT_INVITE_CODE_PLACEHOLDER_C}/join`)
  @HttpCode(HttpStatus.OK)
  public async joinWithInviteCode(
    @ParamModel<ChatInviteDocument>({
      code: CHAT_INVITE_CODE_PLACEHOLDER_C,
    }, ChatInviteSchemaName) chatInvite: ChatInviteDocument,
    @Param(CHAT_INVITE_CODE_PLACEHOLDER) swaggerInviteCode: string,
    @User() userToken: UserTokenInterface,
  ): Promise<MessagingHttpResponseDto> {
    const chat: AbstractMessagingDocument = await this.commonMessagingService.findOne({
      _id: chatInvite.chat,
      deleted: {
        $ne: true,
      },
    });
    if (!chat) {
      throw new NotFoundException('Chat code not found');
    }

    const guestUserString: string
      = await this.clientRedis.getClient().get(this.generateRedisKey(userToken?.tokenId));

    let updatedMessaging: AbstractMessagingDocument = null;
    if (guestUserString) {
      const guestUser: GuestUserInterface = JSON.parse(guestUserString);

      guestUser.tokenId = userToken.tokenId;
      if (chat.members.find((item: ChatMember) => item?.guestUser?.tokenId === guestUser.tokenId)) {
        return messagingToResponseDto(chat);
      }
      if (chat.members.find((item: ChatMember) => item.user === guestUser.contactId)) {
        return messagingToResponseDto(chat);
      }
      updatedMessaging = await this.commonMessagingService.addGuestMember(
        chat,
        guestUser,
        {
          addMethod: AddMemberMethodEnum.INVITE,
          addedBy: null,
          role: ChatMemberRoleEnum.Member,
          withInvitationLink: true,
        },
      );

      return messagingToResponseDto(updatedMessaging);
    }

    if (chat.members.find((item: ChatMember) => item.user === userToken?.id)) {
      return messagingToResponseDto(chat);
    }

    const user: UserDocument = await this.usersService.findById(userToken?.id);


    if (!user || userToken?.id) {
      throw new NotFoundException(`User with id "${userToken.id}" not found`);
    }

    updatedMessaging = await this.commonMessagingService.addMember(
      chat,
      user,
      {
        addMethod: AddMemberMethodEnum.INVITE,
        addedBy: userToken?.id,
        role: ChatMemberRoleEnum.Member,
        withInvitationLink: true,
      },
    );

    return messagingToResponseDto(updatedMessaging);
  }

  private generateRedisKey(key: string): string {
    return `live-chat:session:data:${key}`;
  }
}
