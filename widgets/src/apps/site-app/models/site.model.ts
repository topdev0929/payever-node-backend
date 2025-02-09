import { SiteInterface } from '../interfaces';
import { Document } from 'mongoose';

export interface SiteModel extends  SiteInterface, Document { }
