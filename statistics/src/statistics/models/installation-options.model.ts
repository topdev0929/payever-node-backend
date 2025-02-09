import { Document } from 'mongoose';
import { InstallationOptionsInterface } from '../interfaces/installation-options.interface';

export interface InstallationOptionsModel extends InstallationOptionsInterface, Document { }
