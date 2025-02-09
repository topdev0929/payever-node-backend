import { DropboxMediaModel } from '../models';

export interface DropboxPaginationInterface {
  data: DropboxMediaModel[];
  info: {
    page: string | number;
    perPage: number;
    total: number;
  };
}

