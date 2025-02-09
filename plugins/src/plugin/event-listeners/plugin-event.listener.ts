import { Injectable } from '@nestjs/common';
import { EventListener } from '@pe/nest-kit';
import { PluginCommandNameEnum, PluginEventEnum } from '../enums';
import { PluginFileDto } from '../dto';
import { PluginCommandService } from '../services';
import { PluginModel } from '../models';

@Injectable()
export class PluginEventListener {
  constructor(
    private readonly pluginCommandService: PluginCommandService,
  ) { }

  @EventListener(PluginEventEnum.VersionReleased)
  public async onPluginVersionReleased(
    versionDto: PluginFileDto,
    plugin: PluginModel,
  ): Promise<void> {
    await this.pluginCommandService.createCommand({
      channelType: plugin.channel.type,
      maxCmsVersion: versionDto.maxCmsVersion,
      metadata: {
        filename: versionDto.filename,
      },
      minCmsVersion: versionDto.minCmsVersion,
      name: PluginCommandNameEnum.NotifyNewPluginVersion,
      value: versionDto.version,
    });
  }
}
