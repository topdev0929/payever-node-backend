import { v4 as uuid } from 'uuid';

import {
  Inject,
  Controller,
  Post,
  Patch,
  Param,
  Body,
  UseGuards,
  HttpStatus,
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
} from '@pe/nest-kit';
import {
  MessagingTypeEnum,
} from '@pe/message-kit';

import {
  EventOriginEnum,
} from '../../../message';
import {
  AbstractMessaging,
  CommonMessagingService,
} from '../../../message/submodules/platform';
import { SupportChannelService, SupportChannelDocument } from '../../../message/submodules/messaging/support-channels';
import {
  SupportChannelHttpResponseDto,
} from '../../../message/dto';
import { SupportChannelCreateDto, SupportChannelUpdateDto } from '../../dto';
import { supportChannelToResponseDto } from '../../../message/transformers';

@Controller(`admin/support-channels`)
@ApiTags('admin/support-channels')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Roles(RolesEnum.admin)
export class SupportChannelController {
  @Inject() private readonly supportChannelsService: SupportChannelService;
  @Inject() private readonly commonMessagingService: CommonMessagingService;

  @ApiResponse({ status: HttpStatus.OK, type: SupportChannelHttpResponseDto })
  @Post()
  public async createSupportChannel(
    @Body() dto: SupportChannelCreateDto,
  ): Promise<SupportChannelHttpResponseDto> {
    const createdSupportChannel: SupportChannelDocument = await this.supportChannelsService.create({
      description: '',
      photo: '',
      salt: this.commonMessagingService.createSalt(),
      signed: false,
      title: '',
      ...dto,
      _id: uuid(),
      lastMessages: [],
      members: [],
      type: MessagingTypeEnum.SupportChannel,
    }, EventOriginEnum.MerchantHttpServer);

    return supportChannelToResponseDto(createdSupportChannel);
  }

  @ApiResponse({ status: HttpStatus.OK })
  @Patch(':channelId')
  public async updateSupportChannel(
    @ParamModel(':channelId', AbstractMessaging.name) supportChannel: SupportChannelDocument,
    @Param('channelId') swaggerChannelId: string,
    @Body() dto: SupportChannelUpdateDto,
  ): Promise<SupportChannelHttpResponseDto> {
    const updatedSupportChannel: SupportChannelDocument = await this.supportChannelsService.update({
      ...dto,
      _id: supportChannel._id,
    }, EventOriginEnum.MerchantHttpServer);

    return supportChannelToResponseDto(updatedSupportChannel);
  }
}
