import { Document } from 'mongoose';
import { IntegrationAccessInterface } from '../interfaces';

export interface IntegrationAccessModel extends IntegrationAccessInterface, Document { }
