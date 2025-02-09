import { Document } from 'mongoose';
import { DropboxMediaInterface } from '../interfaces';

export interface DropboxMediaModel extends DropboxMediaInterface, Document {
}
