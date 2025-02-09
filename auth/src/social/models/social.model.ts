import { Document } from 'mongoose';
import { SocialInterface } from '../interfaces';

export interface SocialModel extends SocialInterface, Document { }
