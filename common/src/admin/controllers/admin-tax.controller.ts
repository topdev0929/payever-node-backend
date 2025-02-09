import { Body, Controller, Delete, Get, Param, Patch, Post, Query, UseGuards, ValidationPipe } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { TaxDto, TaxModel, TaxSchemaName } from '@pe/common-sdk';
import { JwtAuthGuard, ParamModel, Roles, RolesEnum } from '@pe/nest-kit';
import { ListDto } from '../dto';
import { AdminTaxService } from '../services';
import { TAX_PLACEHOLDER } from './constants';

@Controller('admin/tax')
@ApiTags('Taxes admin API reference')
@UseGuards(JwtAuthGuard)
@Roles(RolesEnum.admin)
@ApiBearerAuth()
export class AdminTaxController {

  constructor(
    private readonly service: AdminTaxService,
  ) { }

  @Get(TAX_PLACEHOLDER)
  public async getOne(
    @ParamModel({ '_id': TAX_PLACEHOLDER }, TaxSchemaName) tax: TaxModel,
  ): Promise<TaxModel> {
    return tax;
  }

  @Get('/list')
  public async getMany(
    @Query(new ValidationPipe({ transform: true })) dto: ListDto,
  ): Promise<{ page: number; total: number; taxes: TaxModel[] }> {
    return this.service.retrieveListForAdmin(dto);
  }

  @Post()
  public async create(
    @Body() dto: TaxDto,
  ): Promise<TaxModel> {
    return this.service.create(dto);
  }

  @Patch(TAX_PLACEHOLDER)
  public async update(
    @Param('taxId') taxId: string,
    @Body() dto: Partial<TaxDto>,
  ): Promise<TaxModel> {
    return this.service.update(taxId, dto);
  }

  @Delete(TAX_PLACEHOLDER)
  public async delete(
    @ParamModel({ '_id': TAX_PLACEHOLDER }, TaxSchemaName) tax: TaxModel,
  ): Promise<TaxModel> {
    return this.service.delete(tax);
  }

}
