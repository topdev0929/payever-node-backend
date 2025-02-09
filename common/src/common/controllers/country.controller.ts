import { Controller, Get, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { CountryDto, CountryModel, CountryService } from '@pe/common-sdk';

@Controller('country')
@ApiTags('Countries API reference')
export class CountryController {

  constructor(
    private readonly dataService: CountryService,
  ) { }

  @Get('/list')
  @HttpCode(HttpStatus.OK)
  public async list(): Promise<CountryDto[]> {
    const list: CountryModel[] = await this.dataService.findAll();

    return Promise.all(
      list.map((model: CountryModel) => this.dataService.convertModelToDto(model)),
    );
  }
}
