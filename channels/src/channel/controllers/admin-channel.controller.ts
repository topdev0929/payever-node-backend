import {
  Get, Post, Delete, Controller, Query, Patch,
  UseGuards, HttpCode, HttpStatus, Body,
} from '@nestjs/common';
import { ChannelModel, ChannelSchemaName } from '@pe/channels-sdk';
import { ChannelService } from '../services';
import { JwtAuthGuard, ParamModel, Roles, RolesEnum } from '@pe/nest-kit';
import { ChannelQueryDto, AdminChannelDto } from '../dto';
import { ApiTags } from '@nestjs/swagger';


const CHANNEL_ID: string = ':channelId';


@Controller('admin/channels')
@UseGuards(JwtAuthGuard)
@Roles(RolesEnum.admin)
@ApiTags('admin channels')
export class AdminChannelsController {
  constructor(
    private readonly channelService: ChannelService,
  ) { }
  
  @Get()
  public async getAll(
    @Query() query: ChannelQueryDto,
  ): Promise<any> {
    return this.channelService.getForAdmin(query);
  }

  @Get(CHANNEL_ID)
  public async getById(
    @ParamModel(CHANNEL_ID, ChannelSchemaName, true) channel: ChannelModel,
  ): Promise<ChannelModel> {
    return channel;
  }

  @Post()
  @HttpCode(HttpStatus.OK)
  public async create(
    @Body() dto: AdminChannelDto,
  ): Promise<ChannelModel> {
    return this.channelService.createForAdmin(dto);
  }

  @Patch(CHANNEL_ID)
  @HttpCode(HttpStatus.OK)
  public async update(
    @ParamModel(CHANNEL_ID, ChannelSchemaName, true) channel: ChannelModel,
    @Body() dto: AdminChannelDto,
  ): Promise<ChannelModel> {
    return this.channelService.updateForAdmin(channel._id, dto);
  }

  @Delete(CHANNEL_ID)
  @HttpCode(HttpStatus.OK)
  public async delete(
    @ParamModel(CHANNEL_ID, ChannelSchemaName, true) channel: ChannelModel,
  ): Promise<void> {
    await this.channelService.deleteById(channel._id);
  }
}
