import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { ChannelModel } from '@pe/channels-sdk';
import { Model } from 'mongoose';
import * as compareVersions from 'compare-versions';
import { PluginDto } from '../dto';
import { PluginFileModel, PluginModel } from '../models';
import { PluginSchemaName } from '../schemas';
import { EventDispatcher } from '@pe/nest-kit';
import { PluginEventEnum } from '../enums';

@Injectable()
export class PluginService {
  public constructor(
    @InjectModel(PluginSchemaName) private readonly pluginModel: Model<PluginModel>,
    private readonly eventDispatcher: EventDispatcher,
  ) { }

  public async create(
    channel: ChannelModel,
    pluginDto: PluginDto,
  ): Promise<PluginModel> {
    const existentPlugin: PluginModel = await this.findOneByChannel(channel);
    if (existentPlugin) {
      return existentPlugin;
    }

    const createPluginDto: any = {
      ...pluginDto,
      channel: channel,
    };

    const plugin: PluginModel = await this.pluginModel.create(createPluginDto);

    return this.findOneById(plugin._id);
  }

  public async findOneById(pluginId: string): Promise<PluginModel> {
    return this.pluginModel.findById(pluginId);
  }

  public async findOneByChannel(
    channel: ChannelModel,
  ): Promise<PluginModel> {
    return this.pluginModel.findOne({ channel: channel._id });
  }

  public async update(
    plugin: PluginModel,
    dto: PluginDto,
  ): Promise<PluginModel> {
    await this.pluginModel.update(
      { _id: plugin._id },
      { $set: dto as PluginModel },
    ).exec();

    return this.pluginModel.findById(plugin._id);
  }

  public async getLatestVersionByChannel(
    channel: ChannelModel,
    cmsVersion?: string,
  ): Promise<PluginFileModel | null> {
    return this.getLatestVersion(await this.findOneByChannel(channel), cmsVersion);
  }

  public async getLatestVersion(
    plugin: PluginModel,
    cmsVersion?: string,
  ): Promise<PluginFileModel | null> {
    let pluginFiles: PluginFileModel[] = plugin.pluginFiles;

    pluginFiles.forEach(
      (file: PluginFileModel) => {
        // we need a clean semver value
        file.version = file.version.replace(/.+v/, '');
      },
    );

    pluginFiles.sort(
      (a: PluginFileModel, b: PluginFileModel) => compareVersions(a.version, b.version),
    );

    if (cmsVersion) {
      pluginFiles = pluginFiles.filter(
        (file: PluginFileModel) =>
          file.minCmsVersion
            && file.maxCmsVersion
            && compareVersions.compare(file.minCmsVersion, cmsVersion, '<=')
            && compareVersions.compare(file.maxCmsVersion, cmsVersion, '>='),
      );
    }

    return pluginFiles.pop();
  }

  public async addNewVersion(
    plugin: PluginModel,
    dto: any,
  ): Promise<PluginModel> {
    const existingFilenames: string[] = plugin.pluginFiles.map((file: PluginFileModel) => file.filename);

    await plugin.populate('channel').execPopulate();

    if (existingFilenames.includes(dto.filename)) {
      const pluginFile: PluginFileModel = plugin.pluginFiles.find(
        (file: PluginFileModel) => file.filename === dto.filename,
      );

      if (pluginFile.version === dto.version) {
        return plugin;
      }

      pluginFile.version = dto.version;
    } else {
      plugin.pluginFiles.unshift(dto);
    }

    await this.eventDispatcher.dispatch(PluginEventEnum.VersionReleased, dto, plugin);

    return this.pluginModel.findByIdAndUpdate({ _id: plugin.id }, plugin, { new: true });
  }

  public async deleteOneById(pluginId: string): Promise<void> {
    await this.pluginModel.findByIdAndRemove(pluginId).exec();
  }
}
