import { HttpModule, HttpService, MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { FileProcessorService, FileTypeResolverService, ParserWrapperService } from './services';
import { ParserInterface, XmlFileParser, CsvFileParser } from './parsers';
import { PostParseHandlerInterface } from './handlers';
import { postParseHandlers } from './enums';

const parserServiceProvider: any = {
  inject: [FileTypeResolverService, XmlFileParser, CsvFileParser],
  provide: ParserWrapperService,
  useFactory: (
    fileTypeResolver: FileTypeResolverService,
    // tslint:disable-next-line: trailing-comma
    ...parsers: ParserInterface[]
  ): ParserWrapperService => {
    const parser: ParserWrapperService = new ParserWrapperService(fileTypeResolver);
    parsers.forEach((parserStrategy: ParserInterface) => parser.addParser(parserStrategy));

    return parser;
  },
};

const fileProcessorProvider: any = {
  inject: [HttpService, ParserWrapperService, ...postParseHandlers],
  provide: FileProcessorService,
  useFactory: (
    httpService: HttpService,
    parser: ParserWrapperService,
    // tslint:disable-next-line: trailing-comma
    ...handlers: PostParseHandlerInterface[]
  ): FileProcessorService => {
    const processor: FileProcessorService = new FileProcessorService(httpService, parser);
    handlers.forEach((handler: PostParseHandlerInterface) => processor.addHandler(handler));

    return processor;
  },
};

@Module({
  exports: [
    FileProcessorService,
  ],
  imports: [
    HttpModule,
  ],
  providers: [
    XmlFileParser,
    CsvFileParser,
    fileProcessorProvider,
    FileTypeResolverService,
    parserServiceProvider,
    ...postParseHandlers,
  ],
})
export class FileProcessorModule implements NestModule {
  public configure(consumer: MiddlewareConsumer): MiddlewareConsumer | void {
    return undefined;
  }
}
