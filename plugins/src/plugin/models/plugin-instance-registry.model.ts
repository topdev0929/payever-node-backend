import { PluginInstanceRegistryInterface } from '../interfaces';
import { Document } from 'mongoose';
import { PluginCommandModel } from './plugin-command.model';

export interface PluginInstanceRegistryModel extends PluginInstanceRegistryInterface, Document {
  acknowledgedCommands: PluginCommandModel[];
}
