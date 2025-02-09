import { Controller, Get, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { LanguageDto, LanguageModel, LanguageService } from '@pe/common-sdk';

@Controller('language')
@ApiTags('Language API reference')
export class LanguageController {

  constructor(
    private readonly dataService: LanguageService,
  ) { }

  @Get('/list')
  @HttpCode(HttpStatus.OK)
  public async list(): Promise<LanguageDto[]> {
    const list: LanguageModel[] = await this.dataService.findAll();

    return Promise.all(
      list.map((model: LanguageModel) => this.dataService.convertModelToDto(model)),
    );
  }
}
