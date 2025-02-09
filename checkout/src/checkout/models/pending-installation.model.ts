import { Document } from 'mongoose';
import { PendingInstallationInterface } from '../interfaces';

export interface PendingInstallationModel extends PendingInstallationInterface, Document { }
