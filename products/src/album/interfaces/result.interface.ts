import { AlbumModel } from '../models';

export interface ResultInterface {
  result: AlbumModel[];
  totalCount: number;
}
