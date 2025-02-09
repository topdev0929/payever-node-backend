import { Document } from 'mongoose';
import { PluginCommandInterface } from '../interfaces';

export interface PluginCommandModel extends PluginCommandInterface, Document {
}
