import { Body, Controller, Delete, Get, Param, Patch, Post, Query, UseGuards, ValidationPipe } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { CurrencyModel, CurrencySchemaName } from '@pe/common-sdk';
import { JwtAuthGuard, ParamModel, Roles, RolesEnum } from '@pe/nest-kit';
import { ListDto } from '../dto';
import { CurrencyDto } from '../dto/currency.dto';
import { AdminCurrencyService } from '../services';
import { CURRENCY_PLACEHOLDER } from './constants';

@Controller('admin/currency')
@ApiTags('Currencies admin API reference')
@UseGuards(JwtAuthGuard)
@Roles(RolesEnum.admin)
@ApiBearerAuth()
export class AdminCurrencyController {

  constructor(
    private readonly service: AdminCurrencyService,
  ) { }

  @Get(CURRENCY_PLACEHOLDER)
  public async getOne(
    @ParamModel({ '_id': CURRENCY_PLACEHOLDER }, CurrencySchemaName) currency: CurrencyModel,
  ): Promise<CurrencyModel> {
    return currency;
  }

  @Get('/list')
  public async getMany(
    @Query(new ValidationPipe({ transform: true })) dto: ListDto,
  ): Promise<{ page: number; total: number; currencies: CurrencyModel[] }> {
    return this.service.retrieveListForAdmin(dto);
  }

  @Post()
  public async create(
    @Body() dto: CurrencyDto,
  ): Promise<CurrencyModel> {
    return this.service.create(dto);
  }

  @Patch(CURRENCY_PLACEHOLDER)
  public async update(
    @Param('currencyId') currencyId: string,
    @Body() dto: Partial<CurrencyDto>,
  ): Promise<CurrencyModel> {
    return this.service.update(currencyId, dto);
  }

  @Delete(CURRENCY_PLACEHOLDER)
  public async delete(
    @ParamModel({ '_id': CURRENCY_PLACEHOLDER }, CurrencySchemaName) currency: CurrencyModel,
  ): Promise<CurrencyModel> {
    return this.service.delete(currency);
  }

}
