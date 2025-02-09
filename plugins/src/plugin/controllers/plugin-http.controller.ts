import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  NotFoundException,
  BadRequestException,
  Param,
  Query,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ChannelModel, ChannelService } from '@pe/channels-sdk';
import { Acl, AclActionsEnum, InternalBasicAuthGuard, JwtAuthGuard, ParamModel, Roles, RolesEnum } from '@pe/nest-kit';
import { PluginDto, PluginFileDto } from '../dto';
import { PluginFileModel, PluginModel } from '../models';
import { PluginSchemaName } from '../schemas';
import { PluginService, ViewService } from '../services';
import { environment } from '../../environments';
import { FormResponseInterface } from '@pe/third-party-forms-sdk';

const CHANNEL_TYPE: string = ':channelType';

@Controller('plugin')
@UseGuards(JwtAuthGuard)
@ApiTags('plugin')
@ApiBearerAuth()
@ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Invalid authorization token.' })
@ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Unauthorized.' })
export class PluginHttpController {
  public constructor(
    private readonly viewService: ViewService,
    private readonly pluginService: PluginService,
  ) { }

  @Get(':pluginId')
  @Roles(RolesEnum.merchant)
  @HttpCode(HttpStatus.OK)
  @ApiResponse({ status: HttpStatus.OK, description: 'The record has been successfully fetched.' })
  @Acl({ microservice: 'connect', action: AclActionsEnum.read })
  public async findOneById(
    @ParamModel('pluginId', PluginSchemaName) plugin: PluginModel,
  ): Promise<PluginModel> {
    return plugin;
  }

  @Get('channel/:channelType')
  @Roles(RolesEnum.merchant)
  @HttpCode(HttpStatus.OK)
  @ApiResponse({ status: HttpStatus.OK, description: 'The records have been successfully fetched.' })
  @Acl({ microservice: 'connect', action: AclActionsEnum.read })
  public async findAllByChannel(
    @ParamModel({ type: CHANNEL_TYPE }, 'Channel') channel: ChannelModel,
  ): Promise<PluginModel> {
    const plugin: PluginModel = await this.pluginService.findOneByChannel(channel);
    if (!plugin) {
      throw new NotFoundException(`Plugin for channel '${channel.type}' not found'`);
    }

    return plugin;
  }

  @Get('channel/:channelType/form')
  @Roles(RolesEnum.anonymous)
  @HttpCode(HttpStatus.OK)
  @ApiResponse({ status: HttpStatus.OK, description: 'The records have been successfully fetched.' })
  @Acl({ microservice: 'connect', action: AclActionsEnum.read })
  public async getFormByChannel(
    @ParamModel({ type: CHANNEL_TYPE }, 'Channel') channel: ChannelModel,
  ): Promise<FormResponseInterface> {
    const plugin: PluginModel = await this.pluginService.findOneByChannel(channel);
    if (!plugin) {
      throw new NotFoundException(`Plugin for channel '${channel.type}' not found'`);
    }
  
    return this.viewService.getForm(plugin, channel.type);
  }

  @Post('channel/:channelType')
  @Roles(RolesEnum.admin)
  @HttpCode(HttpStatus.OK)
  @ApiResponse({ status: HttpStatus.OK, description: 'The plugin has been successfully created.' })
  public async create(
    @ParamModel({ type: CHANNEL_TYPE }, 'Channel') channel: ChannelModel,
    @Body() pluginDto: PluginDto,
  ): Promise<PluginModel> {
    return this.pluginService.create(channel, pluginDto);
  }

  @Patch(':pluginId')
  @Roles(RolesEnum.admin)
  @HttpCode(HttpStatus.OK)
  @ApiResponse({ status: HttpStatus.OK, description: 'The plugin has been successfully created.' })
  public async patch(
    @ParamModel(':pluginId', 'Plugin') plugin: PluginModel,
    @Body() pluginDto: PluginDto,
  ): Promise<PluginModel> {
    return this.pluginService.update(plugin, pluginDto);
  }

  @Delete(':pluginId')
  @Roles(RolesEnum.admin)
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiResponse({
    description: 'The plugin has been successfully deleted.',
    status: HttpStatus.NO_CONTENT,
  })
  public async remove(
    @Param('pluginId') pluginId: string,
  ): Promise<void> {
    await this.pluginService.deleteOneById(pluginId);
  }

  @Get('channel/:channelType/latest')
  @Roles(RolesEnum.anonymous)
  @HttpCode(HttpStatus.OK)
  @ApiResponse({
    description: 'Get the latest plugin version info',
    status: HttpStatus.OK,
  })
  public async getLatestVersion(
    @ParamModel({ type: CHANNEL_TYPE }, 'Channel') channel: ChannelModel,
    @Query('cmsVersion') cmsVersion?: string,
  ): Promise<PluginFileModel> {
    let version: PluginFileModel;

    try {
      version = await this.pluginService.getLatestVersionByChannel(channel, cmsVersion);
    } catch (e) {
      throw new BadRequestException(e.message);
    }

    if (!version) {
      throw new NotFoundException('Seems like we have no plugin version with given parameters.');
    }

    return version;
  }

  @Post('publish/:channelType')
  @Roles(RolesEnum.anonymous)
  @UseGuards(
    new InternalBasicAuthGuard(
      environment.publishBasicAuth.login,
      environment.publishBasicAuth.password,
    ),
  )
  @HttpCode(HttpStatus.CREATED)
  @ApiResponse({
    description: 'New plugin version has been published.',
    status: HttpStatus.CREATED,
  })
  public async handleNewPluginVersion(
    @ParamModel({ type: CHANNEL_TYPE }, 'Channel') channel: ChannelModel,
    @Body() pluginFileDto: PluginFileDto,
  ): Promise<PluginModel> {
    const plugin: PluginModel = await this.pluginService.findOneByChannel(channel);

    return this.pluginService.addNewVersion(plugin, pluginFileDto);
  }
}
