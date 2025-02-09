import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as compareVersions from 'compare-versions';
import { PluginCommandDto, PluginCommandSearchDto } from '../dto';
import { PluginCommandModel } from '../models';
import { PluginCommandSchemaName } from '../schemas';
import { PluginCommandNameEnum } from '../enums';

@Injectable()
export class PluginCommandService {
  constructor(
    @InjectModel(PluginCommandSchemaName) private readonly pluginCommandModel: Model<PluginCommandModel>,
  ) { }

  public async createCommand(dto: PluginCommandDto): Promise<PluginCommandModel> {
    return this.pluginCommandModel.create(dto as PluginCommandModel);
  }

  public async deleteCommand(command: PluginCommandModel): Promise<any> {
    return this.pluginCommandModel.deleteOne({ _id: command.id });
  }

  public async getList(conditions?: { }): Promise<PluginCommandModel[]> {
    return this.pluginCommandModel.find(conditions || { });
  }

  public async searchCommands(searchDto: PluginCommandSearchDto): Promise<PluginCommandModel[]> {
    const filter: { createdAt?: { }; channelType?: { } } = { };

    if (searchDto.from > 0) {
      filter.createdAt = { $gte: new Date(searchDto.from * 1000).toISOString() };
    }

    if (searchDto.channelType) {
      filter.channelType = { $in: [ searchDto.channelType, null ] };
    }

    const commands: PluginCommandModel[] = await this.getList(filter);

    if (searchDto.cmsVersion) {
      try {
        return this.filterCommandsByCmsVersion(commands, searchDto.cmsVersion);
      } catch (e) {
        // CMS version is not a valid semver
      }
    }

    return commands;
  }

  private filterCommandsByCmsVersion(commands: PluginCommandModel[], cmsVersion: string): PluginCommandModel[] {
    let maxPluginVersion: string;

    let filteredCommands: PluginCommandModel[] = commands.filter((command: PluginCommandModel) => {
      if (command.maxCmsVersion && compareVersions.compare(command.maxCmsVersion, cmsVersion, '<')) {
        return false;
      }

      if (command.minCmsVersion && compareVersions.compare(command.minCmsVersion, cmsVersion, '>')) {
        return false;
      }

      if (command.name === PluginCommandNameEnum.NotifyNewPluginVersion) {
        maxPluginVersion = command.value;
      }

      return true;
    });

    if (maxPluginVersion) {
      // there's no need in multiple version commands, let's give only the latest one
      filteredCommands = filteredCommands.filter((command: PluginCommandModel) =>
        !(command.name === PluginCommandNameEnum.NotifyNewPluginVersion
          && compareVersions.compare(command.value, maxPluginVersion, '<')),
      );
    }

    return filteredCommands;
  }
}
