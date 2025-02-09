import { FileProcessorException, ProcessorErrorKind } from '../exceptions';
import { ParserInterface } from '../parsers';
import { ImportContentDto } from '../../file-imports/dto';
import { Injectable } from '@nestjs/common';
import { FileTypeResolverService } from './file-type-resolver.service';

@Injectable()
export class ParserWrapperService {
  private parsers: Map<string, ParserInterface>;

  constructor(
    private readonly fileTypeResolver: FileTypeResolverService,
  ) {
    this.parsers = new Map();
  }

  public addParser(parser: ParserInterface): void {
    this.parsers.set(parser.getContentType(), parser);
  }

  public async parse(fileContent: string): Promise<ImportContentDto> {
    const contentType: string = this.fileTypeResolver.getType(fileContent);

    return this.getParserForContentType(contentType).parse(fileContent);
  }

  private getParserForContentType(contentType: string): ParserInterface {
    if (!this.parsers.has(contentType)) {
      throw new FileProcessorException(
        ProcessorErrorKind.ParsingFailed,
        `Parser for "${contentType}" not configured`,
        [],
      );
    }

    return this.parsers.get(contentType);
  }
}
