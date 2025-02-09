import { Controller, Get, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { LegalDocumentDto, LegalDocumentModel, LegalDocumentService } from '@pe/common-sdk';

@Controller('legal-document')
@ApiTags('Legal Document API reference')
export class LegalDocumentController {

  constructor(
    private readonly dataService: LegalDocumentService,
  ) { }

  @Get('/list')
  @HttpCode(HttpStatus.OK)
  public async list(): Promise<LegalDocumentDto[]> {
    const list: LegalDocumentModel[] = await this.dataService.findAll();

    return Promise.all(
      list.map((model: LegalDocumentModel) => this.dataService.convertModelToDto(model)),
    );
  }
}
