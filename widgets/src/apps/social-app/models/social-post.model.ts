import { Document } from 'mongoose';
import { SocialPostInterface } from '../interfaces';

export interface SocialPostModel extends SocialPostInterface, Document { }
