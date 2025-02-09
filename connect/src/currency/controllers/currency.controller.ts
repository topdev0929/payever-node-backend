import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { CurrencyDto, CurrencyModel, CurrencyService } from '@pe/common-sdk';
import { JwtAuthGuard, Roles, RolesEnum } from '@pe/nest-kit/modules/auth';

@Controller('currency')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
@Roles(RolesEnum.anonymous)
@ApiTags('currency')
export class CurrencyController {
  constructor(private readonly currencyService: CurrencyService) { }

  @Get('/:currencyCode/code')
  public async getCurrencyByCode(
    @Param('currencyCode') currencyCode: string,
  ): Promise<CurrencyDto> {
    return this.currencyService.convertModelToDto(
      await this.currencyService.getCurrencyByCode(currencyCode),
    );
  }

  @Get()
  public async getCurrenciesList(): Promise<CurrencyDto[]> {
    const list: CurrencyModel[] = await this.currencyService.findAll();

    return Promise.all(
      list.map((model: CurrencyModel) => this.currencyService.convertModelToDto(model)),
    );
  }
}
