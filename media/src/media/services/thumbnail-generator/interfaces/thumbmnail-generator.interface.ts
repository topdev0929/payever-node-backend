import { ArgumentMediaContainerEnum } from '../../../enum';
import { MimeTypesEnum } from '../../../../tools/mime-types.enum';
import { FsFile } from '../../../interfaces';

export interface ThumbnailGeneratorResult {
  blobName?: string;
}

export interface ThumbnailGeneratorInterface {
  doesSupport(mimeType: MimeTypesEnum): boolean;
  generate(container: ArgumentMediaContainerEnum, file: FsFile): Promise<ThumbnailGeneratorResult>;
}
