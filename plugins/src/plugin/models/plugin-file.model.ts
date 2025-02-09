import { Document } from 'mongoose';
import { PluginFileInterface } from '../interfaces/plugin-file.interface';

export interface PluginFileModel extends PluginFileInterface, Document { }
