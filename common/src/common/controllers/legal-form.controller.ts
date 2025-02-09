import { Controller, Get, HttpCode, HttpStatus, Param } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { LegalFormDto, LegalFormModel, LegalFormService } from '@pe/common-sdk';

@Controller('legal-form')
@ApiTags('Legal Form API reference')
export class LegalFormController {

  constructor(
    private readonly dataService: LegalFormService,
  ) { }

  @Get('/list/:countryCode')
  @HttpCode(HttpStatus.OK)
  public async listByCountry(
    @Param('countryCode') countryCode: string,
  ): Promise<LegalFormDto[]> {
    const list: LegalFormModel[] = await this.dataService.findAllByCountry(countryCode.toUpperCase());

    return Promise.all(
      list.map((model: LegalFormModel) => this.dataService.convertModelToDto(model)),
    );
  }
}
