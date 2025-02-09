import { Controller, Get, Param, Req, Logger, Query } from '@nestjs/common';
import { ProductService } from '../services';
import { SortDirectionEnum } from '../dto/sort.dto';

import { Request } from 'express';
import { ProductsPaginatedInterface } from '../interfaces';

@Controller('api/synchronizer')
export class SynchronizerController {
  constructor(
    private readonly logger: Logger,
    private readonly productService: ProductService,
  ) { }

  @Get(':businessUuid')
  public async getBusinessProducts(
    @Param('businessUuid') businessUuid: string,
      @Query() query: any,
  ): Promise<any> {
    this.logger.log( { query });
    // synchronizer paging format
    const limit: number = Number(query.limit) || 100;
    const offset: number = Number(query.offset) || 0;
    const page: number = limit > 0 && offset > 0 ? (offset / limit) + 1 : 1;

    const result: ProductsPaginatedInterface = await this.productService.getProducts(
      businessUuid,
      [{ direction: SortDirectionEnum.DESC, field: 'updatedAt'}],
      { page, limit},
    );

    return  { ...result, products: undefined, items: result.products };
  }
}
