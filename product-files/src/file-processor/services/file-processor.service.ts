import { HttpService, Injectable } from '@nestjs/common';
import { FileImportDto, ImportContentDto } from '../../file-imports/dto';
import { FileProcessorException, ProcessorErrorKind } from '../exceptions';
import { PostParseHandlerInterface } from '../handlers';
import { ParserWrapperService } from './parser-wrapper.service';

@Injectable()
export class FileProcessorService {
  private handlers: PostParseHandlerInterface[] = [];

  constructor(
    private readonly httpService: HttpService,
    private readonly parser: ParserWrapperService,
  ) { }

  public addHandler(handler: PostParseHandlerInterface): void {
    this.handlers.push(handler);
  }

  public async processFile(fileImport: FileImportDto): Promise<ImportContentDto> {
    const file: string = await this.fetchFile(fileImport);
    const importContentDto: ImportContentDto = await this.parser.parse(file);
    importContentDto.errors = importContentDto.errors || [];

    for (const handler of this.handlers) {
      const { products, errors }: any = await handler.handle(importContentDto.products, fileImport);
      importContentDto.products = products;
      importContentDto.errors = importContentDto.errors.concat(errors);
    }

    return importContentDto;
  }

  private async fetchFile(fileImport: FileImportDto): Promise<string> {
    const resp: any = await this.httpService.get(
      fileImport.fileUrl,
      { validateStatus: () => true },
    ).toPromise();

    if (resp.status !== 200) {
      throw new FileProcessorException(
        ProcessorErrorKind.FetchFailed,
        `failed to fetch ${fileImport.fileUrl}`,
        resp,
      );
    }

    return resp.data;
  }
}
