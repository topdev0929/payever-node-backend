import { Document } from 'mongoose';
import { OAuthTokenInterface } from '../interfaces';

export interface OAuthTokenModel extends OAuthTokenInterface, Document {
}
