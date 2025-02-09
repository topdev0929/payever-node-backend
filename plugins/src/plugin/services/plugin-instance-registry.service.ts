import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import * as crypto from 'crypto';
import { Model } from 'mongoose';
import { PluginInstanceRegistryCreateDto } from '../dto';
import { PluginInstanceRegistryDto } from '../dto/plugin-instance-registry.dto';
import { PluginCommandModel, PluginInstanceRegistryModel } from '../models';
import { PluginInstanceRegistrySchemaName } from '../schemas';

@Injectable()
export class PluginInstanceRegistryService {
  constructor(
    @InjectModel(PluginInstanceRegistrySchemaName)
    private readonly pluginRegistryRecordModel: Model<PluginInstanceRegistryModel>,
  ) { }

  public async register(dto: PluginInstanceRegistryCreateDto): Promise<PluginInstanceRegistryModel> {
    const id: string = this.generateIdFromDto(dto);

    if (!await this.findById(id)) {
      return this.pluginRegistryRecordModel.create({ _id: id, ...dto } as PluginInstanceRegistryModel);
    } else {
      return this.updateById(id, dto);
    }
  }

  public async unregister(dto: PluginInstanceRegistryDto): Promise<PluginInstanceRegistryModel> {
    return this.pluginRegistryRecordModel.findOneAndDelete({ _id: this.generateIdFromDto(dto) });
  }

  public async acknowledgeCommand(
    dto: PluginInstanceRegistryDto,
    command: PluginCommandModel,
  ): Promise<PluginInstanceRegistryModel> {
    const registryRecord: PluginInstanceRegistryModel = await this.findById(this.generateIdFromDto(dto));
    if (!registryRecord) {
      throw new NotFoundException('Registry record not found. Please register yourself first.');
    }

    await registryRecord.populate('acknowledgedCommands').execPopulate();

    if (registryRecord.acknowledgedCommands.map((item: PluginCommandModel) => item.id).includes(command.id)) {
      return registryRecord;
    }

    registryRecord.acknowledgedCommands.push(command);

    return this.updateById(
      registryRecord.id, 
      registryRecord.toObject({ versionKey: false }) as PluginInstanceRegistryModel,
      );
  }

  private async findById(id: string): Promise<PluginInstanceRegistryModel> {
    return this.pluginRegistryRecordModel.findOne({ _id: id });
  }

  private async updateById(
    id: string,
    values: PluginInstanceRegistryModel | PluginInstanceRegistryCreateDto,
  ): Promise<PluginInstanceRegistryModel> {
    return this.pluginRegistryRecordModel.findByIdAndUpdate(
      { _id: id },
      values,
      { new: true },
    );
  }

  private generateIdFromDto(dto: PluginInstanceRegistryDto): string {
    return crypto.createHash('sha1')
      .update(`${dto.host}${dto.channel}`)
      .digest('hex');
  }
}
