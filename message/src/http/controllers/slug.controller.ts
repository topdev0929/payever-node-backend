import {
  Controller,
  Get,
  Post,
  Body,
  Req,
  Param,
  Delete,
  HttpCode,
  HttpStatus,
  Inject,
  UseGuards,
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
  User,
  UserTokenInterface,
  JwtAuthGuard,
} from '@pe/nest-kit';
import { MessagingTypeEnum, ChatMemberRoleEnum } from '@pe/message-kit';

import { AbstractMessaging, CommonMessagingService } from '../../message/submodules/platform';
import { CommonChannelDocument } from '../../message/submodules/messaging/common-channels';
import { ChannelTypeEnum, AddMemberMethodEnum } from '../../message';
import { PublicChannelSlugDto } from '../dto';
import { publicChannelToSlugResponseDtoTransformer } from '../transformers';
import { UsersService } from '../../projections';
import { UserDocument } from '../../projections/models';
import { AuthClientService } from '../../message/client';

@Controller('public-channels')
@ApiTags('messaging/common-channels')
@Roles(RolesEnum.anonymous)
export class SlugController {
  @Inject() private readonly commonMessagingService: CommonMessagingService;
  @Inject() private readonly usersService: UsersService;
  @Inject() private readonly authClientService: AuthClientService;

  @Get('by-slug/:slug')
  @ApiResponse({ status: HttpStatus.OK, type: PublicChannelSlugDto })
  public getBySlug(
    @ParamModel({
      slug: `:slug`,
      subType: `=${ChannelTypeEnum.Public}`,
      type: `=${MessagingTypeEnum.Channel}`,
    }, AbstractMessaging.name, true) publicChannel: CommonChannelDocument,
  ): PublicChannelSlugDto {
    return publicChannelToSlugResponseDtoTransformer(publicChannel);
  }

  @Post('live-chat/guest-token')
  @ApiResponse({ status: HttpStatus.OK, type: PublicChannelSlugDto })
  public async getGuestToken(
    @Body() dto: {
      visitorHash: string;
    },
    @Req() request: any,
  ): Promise<any> {
    const userAgent: string = request.headers['user-agent'];

    return this.authClientService.getGuestToken(userAgent, dto.visitorHash);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Post('by-slug/:slug/join')
  @HttpCode(HttpStatus.OK)
  @Roles(RolesEnum.user, RolesEnum.merchant)
  @ApiResponse({ status: HttpStatus.OK, type: PublicChannelSlugDto })
  public async join(
    @ParamModel({
      slug: `:slug`,
      subType: `=${ChannelTypeEnum.Public}`,
      type: `=${MessagingTypeEnum.Channel}`,
    }, AbstractMessaging.name, true) publicChannel: CommonChannelDocument,
    @User() userToken: UserTokenInterface,
  ): Promise<PublicChannelSlugDto> {
    if (!this.commonMessagingService.containMember(publicChannel, userToken.id)) {
      const user: UserDocument = await this.usersService.findById(userToken.id);
      if (!user) {
        throw new NotFoundException(`User with id "${userToken.id}" not found`);
      }
      await this.commonMessagingService.addMember(
        publicChannel,
        user,
        {
          addMethod: AddMemberMethodEnum.SLUG,
          addedBy: user.id,
          role: ChatMemberRoleEnum.Subscriber,
          withInvitationLink: false,
        },
      );
    }

    return publicChannelToSlugResponseDtoTransformer(publicChannel);
  }
}
