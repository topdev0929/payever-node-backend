import { Document } from 'mongoose';
import { UserAlbumInterface } from '../interfaces';

export interface UserAlbumModel extends UserAlbumInterface, Document {
}
