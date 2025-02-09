import {
  Controller,
  Post,
  UseGuards,
  HttpCode,
  HttpStatus,
  Get,
  Param,
  NotFoundException,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags, ApiResponse } from '@nestjs/swagger';
import {
  AbstractController,
  JwtAuthGuard,
  ParamModel,
  Roles,
  RolesEnum,
  User,
  UserTokenInterface,
  RedisClient,
} from '@pe/nest-kit';
import { ChatMemberRoleEnum } from '@pe/message-kit';
import { AddMemberMethodEnum } from '../../message';
import {
  MessagingHttpResponseDto,
} from '../../message/dto';
import {
  AbstractMessaging,
  AbstractMessagingDocument,
  CommonMessagingService,
  ChatMember,
  GuestUserInterface,
} from '../../message/submodules/platform';
import {
  BUSINESS_ID_NON_GUARDED_PLACEHOLDER_C,
  CHAT_ID_PLACEHOLDER_C,
  INTEGRATION_LINK_ID_PLACEHOLDER,
  INTEGRATION_LINK_ID_PLACEHOLDER_C,
} from './const';
import { messagingToResponseDto } from '../../message/transformers';
import { IntegrationLinkInterface } from '../../message/submodules/integration-link/interfaces';
import { IntegrationLinkService } from '../../message/submodules/integration-link';

@Controller(`business/${BUSINESS_ID_NON_GUARDED_PLACEHOLDER_C}/chats`)
@ApiTags('chat-messages')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
@Roles(RolesEnum.anonymous)
export class GuestController extends AbstractController {
  constructor(
    private readonly commonMessagingService: CommonMessagingService,
    private readonly clientRedis: RedisClient,
    private readonly integrationLinkService: IntegrationLinkService,
  ) {
    super();
  }

  @ApiResponse({ status: HttpStatus.OK, type: MessagingHttpResponseDto })
  @Post(`${CHAT_ID_PLACEHOLDER_C}/join`)
  @HttpCode(HttpStatus.OK)
  public async joinWithInviteCode(
    @ParamModel({
      _id: CHAT_ID_PLACEHOLDER_C,
    }, AbstractMessaging.name) chat: AbstractMessagingDocument,
    @User() userToken: UserTokenInterface,
  ): Promise<MessagingHttpResponseDto> {
    const guestUserString: string
      = await this.clientRedis.getClient().get(this.generateRedisKey(userToken?.tokenId));

    let updatedMessaging: AbstractMessagingDocument = null;
    if (guestUserString) {
      const guestUser: GuestUserInterface = JSON.parse(guestUserString);

      this.commonMessagingService.syncChatDataToLiveSide({ chat, guest: guestUser });

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
          addMethod: AddMemberMethodEnum.GUEST,
          addedBy: null,
          role: ChatMemberRoleEnum.Member,
          withInvitationLink: true,
        },
      );

      return messagingToResponseDto(updatedMessaging);
    }
  }


  @ApiResponse({ status: HttpStatus.OK })
  @Get(`${INTEGRATION_LINK_ID_PLACEHOLDER_C}/link`)
  @HttpCode(HttpStatus.OK)
  public async getIntegrationLinkData(
    @User() userToken: UserTokenInterface,
    @Param(INTEGRATION_LINK_ID_PLACEHOLDER) integrationId: string,
  ): Promise<IntegrationLinkInterface> {

    const integrationLink: IntegrationLinkInterface = await this.integrationLinkService.findById(integrationId);

    if (!integrationLink) {
      throw new NotFoundException(`integration link by ${integrationId} not found`);
    }

    return integrationLink;
  }

  private generateRedisKey(key: string): string {
    return `live-chat:session:data:${key}`;
  }
}
