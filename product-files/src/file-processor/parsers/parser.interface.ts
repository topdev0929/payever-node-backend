import { ImportContentDto } from '../../file-imports/dto';

export interface ParserInterface {
  parse(data: string): Promise<ImportContentDto>;
  getContentType(): string;
}
