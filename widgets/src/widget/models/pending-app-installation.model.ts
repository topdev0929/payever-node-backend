import { PendingAppInstallationInterface } from '../interfaces';
import { Document } from 'mongoose';

export interface PendingAppInstallationModel extends PendingAppInstallationInterface, Document { }
