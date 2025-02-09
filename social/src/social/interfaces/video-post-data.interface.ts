import { BusinessLocalModel } from '../../business/models';
import { PostModel } from '../models';
import { ThumbNailUrlInterface } from './thumbail.interface';

export interface VideoPostDataInterface {
  business: BusinessLocalModel;
  filePath: string;
  post: PostModel;
  randomTempFolder: string;
  payload?: ThumbNailUrlInterface[];
}
