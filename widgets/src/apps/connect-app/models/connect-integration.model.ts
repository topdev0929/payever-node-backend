import { ConnectIntegrationInterface } from '../interfaces';
import { Document } from 'mongoose';

export interface ConnectIntegrationModel extends  ConnectIntegrationInterface, Document { }
