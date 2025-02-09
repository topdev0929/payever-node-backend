import { Controller, Get, HttpCode, HttpStatus, Param } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { TaxDto, TaxModel, TaxService } from '@pe/common-sdk';

@Controller('tax')
@ApiTags('Tax API reference')
export class TaxController {

  constructor(
    private readonly dataService: TaxService,
  ) { }

  @Get('/list/:countryCode')
  @HttpCode(HttpStatus.OK)
  public async listByCountry(
    @Param('countryCode') countryCode: string,
  ): Promise<TaxDto[]> {
    const list: TaxModel[] = await this.dataService.findAllByCountry(countryCode.toUpperCase());

    return Promise.all(
      list.map((model: TaxModel) => this.dataService.convertModelToDto(model)),
    );
  }
}
