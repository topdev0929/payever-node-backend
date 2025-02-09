import { Controller, Get, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { CurrencyDto, CurrencyModel, CurrencyService } from '@pe/common-sdk';

@Controller('currency')
@ApiTags('Currencies API reference')
export class CurrencyController {

  constructor(
    private readonly dataService: CurrencyService,
  ) { }

  @Get('/list')
  @HttpCode(HttpStatus.OK)
  public async list(): Promise<CurrencyDto[]> {
    const list: CurrencyModel[] = await this.dataService.findAll();

    return Promise.all(
      list.map((model: CurrencyModel) => this.dataService.convertModelToDto(model)),
    );
  }
}
