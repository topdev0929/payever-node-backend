import { Document } from 'mongoose';
import { AlbumInterface } from '../interfaces';

export interface AlbumModel extends AlbumInterface, Document {
}
