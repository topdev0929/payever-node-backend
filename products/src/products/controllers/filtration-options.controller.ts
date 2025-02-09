import { Body, Controller, HttpCode, HttpStatus, Param, Post } from '@nestjs/common';
import { ProductsElasticService } from '../services';
import { FilterInterface } from '../../common/interfaces/filter.interface';

@Controller(':businessId/filter-attributes')
export class FiltrationOptionsController {
  constructor(
    private productElasticService: ProductsElasticService,
  ) { }

  @Post()
  @HttpCode(HttpStatus.OK)
  public async getOptionsWithValue(
    @Param('businessId') businessId: string,
    @Body() filterDto: FilterInterface[],
  ): Promise<any> {

    return this.productElasticService.getAvailableAttributes(filterDto, businessId);
  }
}
