import { Document } from 'mongoose';
import { SceneInfoInterface } from '../interfaces';

export interface SceneInfoModel extends SceneInfoInterface, Document {
}
