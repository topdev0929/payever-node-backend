import { MimeTypesEnum } from '../../tools/mime-types.enum';

export interface CompressResult {
  mimeType?: string;
}

export interface CompressorInterface {
  doesSupport(mimeType: MimeTypesEnum): boolean;
  compress(inputFilePath: string, outputFilePath: string): Promise<CompressResult>;
}
